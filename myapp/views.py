from django.shortcuts import render, redirect
from django.contrib.auth.models import User, auth
from django.contrib import messages
from django.http import HttpResponse
from .models import Room, Menu, images
from django.shortcuts import get_object_or_404
import re

def index(request):
    rooms = Room.objects.all()[:3]
    return render(request, 'index.html', {'rooms': rooms})

def about_view(request):
    return render(request, 'about.html')

def contact_view(request):
    return render(request, 'contact.html')

def events_view(request):
    return render(request, 'events.html')

def gallery_view(request):
    gallery = images.objects.all()
    return render(request, 'gallery.html', {'gallery': gallery})

def menu_view(request):
    menu = Menu.objects.all()
    return render(request, 'menu.html', {'menu': menu})

def restaurant_view(request):
    return render(request, 'restaurant.html')

def clean_price(price_str):
    cleaned = re.sub(r'[^\d.]', '', price_str)
    try:
        return float(cleaned)
    except ValueError:
        return 0

def roomdetails_view(request):
    room_id = request.GET.get('room_id')
    room = get_object_or_404(Room, id=room_id)

    price = room.price
    price_tolerance = 50
    similar_rooms = Room.objects.filter(
        price__gte=price - price_tolerance,
        price__lte=price + price_tolerance
    ).exclude(id=room.id)[:3]  # limit to 3 similar rooms

    context = {
        'room': room,
        'similar_rooms': similar_rooms,
    }
    return render(request, 'roomdetails.html', context)

def rooms_view(request):
    rooms = Room.objects.all()
    return render(request, 'rooms.html', {'rooms': rooms})

def register(request):
    if request.method == 'POST':
        username = request.POST['username']
        email = request.POST['email']
        password = request.POST['password']
        confirmPassword = request.POST['confirmPassword']

        if password == confirmPassword:
            if User.objects.filter(email=email).exists():
                messages.warning(request, 'Email Has Already Been Used')
                return redirect('register')
            elif User.objects.filter(username=username).exists():
                messages.warning(request, 'Username Has Already Been Used')
                return redirect('register')
            else:
                user = User.objects.create_user(username = username, email = email, password = password)
                user.save();
                return redirect('login')
        else:
            messages.info(request, 'Password doesnot match')
            return redirect('register')
    else:
        return render(request, 'register.html')
    
def login(request):
    if request.method == 'POST':
        login_input = request.POST['username']
        password = request.POST['password']

        try:
            user_obj = User.objects.get(email=login_input)
            username = user_obj.username
        except User.DoesNotExist:
            username = login_input 
        
        user = auth.authenticate(username = username, password = password)
        
        if user is not None:
            auth.login(request, user)
            return redirect('/')
        else:
            messages.info(request, 'Invalid Credentials')
            return redirect ('login')
    else:
        return render(request, 'login.html')

def logout(request):
    auth.logout(request)
    return redirect('/')

def post(request, pk):
    return render(request, 'post.html', {'pk': pk})


### ------------- Payment gateways and odering logic here ------------- ###

from django.conf import settings
from django.shortcuts import render, redirect, get_object_or_404
from django.http import JsonResponse, HttpResponseBadRequest
from django.views.decorators.csrf import csrf_exempt
from decimal import Decimal
import requests
from datetime import datetime

from .models import FoodItem, Room, Order
from .forms import FoodOrderForm, RoomBookingForm

### ------------- ORDER CREATION ------------- ###
def create_food_order(request):
    if request.method != "POST":
        return HttpResponseBadRequest("Invalid method")

    form = FoodOrderForm(request.POST)
    if not form.is_valid():
        return HttpResponseBadRequest("Invalid form")

    food = get_object_or_404(FoodItem, id=form.cleaned_data["food_id"])
    qty = form.cleaned_data["quantity"]
    amount = Decimal(food.price) * qty

    order = Order.objects.create(
        user=request.user if request.user.is_authenticated else None,
        order_type="food",
        item_name=food.name,
        amount=amount,
        quantity=qty,
    )
    return redirect("payment_select", order_id=order.id)

def create_room_order(request):
    if request.method != "POST":
        return HttpResponseBadRequest("Invalid method")

    form = RoomBookingForm(request.POST)
    if not form.is_valid():
        return HttpResponseBadRequest("Invalid form")

    room = get_object_or_404(Room, id=form.cleaned_data["room_id"])
    check_in = form.cleaned_data["check_in"]
    check_out = form.cleaned_data["check_out"]

    # naive nights calc (no tz/time); add validation as needed
    nights = (check_out - check_in).days
    if nights <= 0:
        return HttpResponseBadRequest("Check-out must be after check-in")

    amount = Decimal(room.price_per_night) * nights

    order = Order.objects.create(
        user=request.user if request.user.is_authenticated else None,
        order_type="room",
        item_name=f"{room.title} ({nights} night{'s' if nights>1 else ''})",
        amount=amount,
        room=room,
        check_in=check_in,
        check_out=check_out,
        guests=form.cleaned_data["guests"],
    )
    return redirect("payment_select", order_id=order.id)

### ------------- PAYMENT SELECTION ------------- ###
def payment_select(request, order_id):
    order = get_object_or_404(Order, id=order_id, status="PENDING")
    return render(request, "payment_select.html", {"order": order})

### ------------- eSEWA FLOW ------------- ###
def esewa_init(request, order_id):
    order = get_object_or_404(Order, id=order_id, status="PENDING")
    esewa = settings.ESEWA
    base = settings.BASE_URL

    # eSewa expects: amt, psc, pdc, txAmt, tAmt, pid, scd, su, fu
    payload = {
        "amt": order.amount,         # base amount
        "psc": 0,                    # service charge
        "pdc": 0,                    # delivery charge
        "txAmt": 0,                  # tax amount
        "tAmt": order.amount,        # total amount
        "pid": str(order.id),        # unique payment id
        "scd": esewa["SCD"],         # merchant code
        "su": f"{base}/esewa/callback/success/?oid={order.id}",
        "fu": f"{base}/esewa/callback/failure/?oid={order.id}",
    }
    # Render a form that auto-posts to eSewa
    return render(request, "esewa_redirect.html", {"ESEWA_URL": esewa["ESEWA_URL"], "payload": payload})

@csrf_exempt
def esewa_success(request):
    """
    eSewa will redirect with ?oid=<pid>&amt=<amt>&refId=<refId>
    We must verify server-to-server.
    """
    oid = request.GET.get("oid")
    amt = request.GET.get("amt")
    ref_id = request.GET.get("refId")

    order = get_object_or_404(Order, id=oid)
    if str(order.amount) != str(amt):
        return redirect("payment_failure", order_id=order.id)

    # Verify with eSewa:
    esewa = settings.ESEWA
    data = {
        "amt": amt,
        "scd": esewa["SCD"],
        "rid": ref_id,
        "pid": str(order.id),
    }
    r = requests.post(esewa["VERIFY_URL"], data=data, timeout=15)

    if "Success" in r.text:
        order.status = "PAID"
        order.gateway = "esewa"
        order.payment_reference = ref_id
        order.save()
        return redirect("payment_success", order_id=order.id)
    else:
        order.status = "FAILED"
        order.gateway = "esewa"
        order.payment_reference = ref_id or ""
        order.save()
        return redirect("payment_failure", order_id=order.id)

@csrf_exempt
def esewa_failure(request):
    oid = request.GET.get("oid")
    order = get_object_or_404(Order, id=oid)
    order.status = "FAILED"
    order.gateway = "esewa"
    order.save()
    return redirect("payment_failure", order_id=order.id)

### ------------- KHALTI FLOW ------------- ###
@csrf_exempt
def khalti_verify(request):
    """
    AJAX POST from frontend (after successful Khalti checkout) with:
    token, amount, order_id
    We verify with Khalti server and mark the order.
    """
    if request.method != "POST":
        return JsonResponse({"ok": False, "msg": "Invalid method"}, status=400)

    token = request.POST.get("token")
    amount = request.POST.get("amount")  # in paisa (string)
    order_id = request.POST.get("order_id")

    if not all([token, amount, order_id]):
        return JsonResponse({"ok": False, "msg": "Missing fields"}, status=400)

    order = get_object_or_404(Order, id=order_id)

    # Double-check the amount matches
    expected = int(Decimal(order.amount) * 100)  # paisa
    if str(expected) != str(amount):
        return JsonResponse({"ok": False, "msg": "Amount mismatch"}, status=400)

    headers = {"Authorization": f"Key {settings.KHALTI['SECRET_KEY']}"}
    payload = {"token": token, "amount": amount}

    resp = requests.post(settings.KHALTI["VERIFY_URL"], data=payload, headers=headers, timeout=15)
    if resp.status_code == 200:
        # Success
        order.status = "PAID"
        order.gateway = "khalti"
        order.payment_reference = token
        order.save()
        return JsonResponse({"ok": True, "redirect": f"/payment/success/{order.id}/"})
    else:
        order.status = "FAILED"
        order.gateway = "khalti"
        order.payment_reference = token
        order.save()
        return JsonResponse({"ok": False, "redirect": f"/payment/failure/{order.id}/"}, status=400)

### ------------- RESULT PAGES ------------- ###
def payment_success(request, order_id):
    order = get_object_or_404(Order, id=order_id)
    return render(request, "payment_success.html", {"order": order})

def payment_failure(request, order_id):
    order = get_object_or_404(Order, id=order_id)
    return render(request, "payment_failure.html", {"order": order})

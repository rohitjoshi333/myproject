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
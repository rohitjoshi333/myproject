from django.shortcuts import render, redirect
from django.contrib.auth.models import User, auth
from django.contrib import messages
from django.http import HttpResponse
from .models import feature
from .models import room
from .models import roomdetail
from django.shortcuts import get_object_or_404

# Create your views here.
def index(request):
    features = feature.objects.all()
    return render(request, 'index.html', {'features': features})

def about_view(request):
    return render(request, 'about.html')

def contact_view(request):
    return render(request, 'contact.html')

def events_view(request):
    return render(request, 'events.html')

def gallery_view(request):
    return render(request, 'gallery.html')

def menu_view(request):
    return render(request, 'menu.html')

def restaurant_view(request):
    return render(request, 'restaurant.html')

def roomdetails_view(request):
    room_category = request.GET.get('room', '').lower()
    selected_room = get_object_or_404(roomdetail, category__iexact=room_category)
    return render(request, 'roomdetails.html', {'room': selected_room})

def rooms_view(request):
    rooms = room.objects.all()
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
from django.shortcuts import render
from django.http import HttpResponse
from .models import feature
from .models import room
# Create your views here.
def index(request):
    feature1 = feature()
    feature1.id = 0
    feature1.name = 'Deluxe Room'
    feature1.description = 'Elegant room with modern amenities and city view'
    feature1.price = '₹2,800'

    feature2 = feature()
    feature2.id = 1
    feature2.name = 'Queen Suite'
    feature2.description = 'Spacious suite with separate living area and premium amenities'
    feature2.price = '₹4,500'
    
    feature3 = feature()
    feature3.id = 2
    feature3.name = 'Presidential Suite'
    feature3.description = 'Ultimate luxury with panoramic views and exclusive services'
    feature3.price = '₹8,000'

    features = [feature1, feature2, feature3]

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

    # Define all room objects (you can extract this to a helper if needed)
    room1 = room()
    room1.id = 0
    room1.category = 'deluxe'
    room1.name = 'Deluxe Room'
    room1.description = 'Elegant room with modern amenities and city view'
    room1.price = '₹2,800'
    room1.guest_count = '1 Guests'
    room1.amenities = [
        "📶 High-Speed WiFi", "❄️ Air Conditioning", "📺 Smart TV", "☕ Mini Bar",
        "🛏️ King Size Bed", "🚿 Premium Bathroom", "🔒 Electronic Safe", "☎️ 24/7 Room Service"
    ]

    room1.images = [
    "images/rooms/deluxe/deluxe1.jpg",
    "images/rooms/deluxe/deluxe2.jpg",
    "images/rooms/deluxe/deluxe3.jpg"
    ]

    room2 = room()
    room2.id = 1
    room2.category = 'family-room'
    room2.name = 'Queen Suite'
    room2.description = 'Spacious suite with separate living area and premium amenities'
    room2.price = '₹4,500'
    room2.guest_count = '2 Guests'
    room2.amenities = room1.amenities

    room3 = room()
    room3.id = 2
    room3.category = 'presidential-suite'
    room3.name = 'Presidential Suite'
    room3.description = 'Ultimate luxury with panoramic views and exclusive services'
    room3.price = '₹8,000'
    room3.guest_count = '3 Guests'
    room3.amenities = room1.amenities

    rooms = [room1, room2, room3]

    # Find room by category
    selected_room = next((r for r in rooms if r.category.lower() == room_category), None)

    if selected_room:
        return render(request, 'roomdetails.html', {'room': selected_room})
    else:
        return render(request, '404.html', status=404)

def rooms_view(request):
    room1 = room()
    room1.id = 0
    room1.category = 'Deluxe'
    room1.name = 'Deluxe Room'
    room1.description = 'Elegant room with modern amenities and city view'
    room1.price = '₹2,800'
    room1.guest_count = '1 Guests'
    room1.image = '/static/imgs/deluxe-single.jpg'
    room1.status = 'Booked'

    room2 = room()
    room2.id = 1
    room2.category = 'family-room'
    room2.name = 'Queen Suite'
    room2.description = 'Spacious suite with separate living area and premium amenities'
    room2.price = '₹4,500'
    room2.guest_count = '2 Guests'
    room2.image = '/static/imgs/Super Deluxe Room/IMG_6995.jpg'
    room2.status = 'Unavailable'
    
    room3 = room()
    room3.id = 2
    room3.category = 'presidential-suite'
    room3.name = 'Presidential Suite'
    room3.description = 'Ultimate luxury with panoramic views and exclusive services'
    room3.price = '₹8,000'
    room3.guest_count = '3 Guests'
    room3.image = '/static/imgs/Presidential Suit Room/IMG_6984.jpg'
    room3.status = 'Available'
    

    rooms = [room1, room2, room3]

    return render(request, 'rooms.html', {'rooms': rooms})
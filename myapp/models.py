from django.db import models
from django.core.exceptions import ValidationError
import os
from io import BytesIO
from django.core.files.base import ContentFile
from django.contrib.auth.models import User


#--------------------------------------------------------------
# ROOM MODEL HERE --------------------------------------------|
#--------------------------------------------------------------

class Room(models.Model):
    ROOM_STATUS_CHOICES = [
        ('available', 'Available'),
        ('booked', 'Booked'),
        ('unavailable', 'Unavailable'),
    ]

    category = models.CharField(max_length=100)
    name = models.CharField(max_length=100)
    description = models.TextField(default='No description')
    price = models.PositiveIntegerField(default=0) 
    guest_count = models.PositiveIntegerField(default=1)
    amenities = models.TextField(default='No amenities')
    thumbnail = models.ImageField(upload_to='room_thumbnails/', null=True, blank=True)
    status = models.CharField(max_length=20, choices=ROOM_STATUS_CHOICES, default='available')

    def __str__(self):
        return f"{self.name} ({self.category})"

    def get_amenities_list(self):
        return [a.strip() for a in self.amenities.split(',') if a.strip()]

    def get_amenities_with_icons(self):
        icon_map = {
            'wifi': 'fa-wifi',
            'air condition': 'fa-snowflake',
            'ac': 'fa-snowflake',
            'satellite tv': 'fa-tv',
            'smarttv': 'fa-tv',
            'breakfast': 'fa-utensils',
            'parking': 'fa-parking',
            'pool': 'fa-swimming-pool',
            'gym': 'fa-dumbbell',
            'spa': 'fa-spa',
            'pet friendly': 'fa-dog',
            'coffee': 'fa-mug-hot',
            'balcony': 'fa-building',
            'refrigerator': 'fa-temperature-low',
            'king bed': 'fa-bed',
            'living room': 'fa-couch',
            'dining area': 'fa-utensils',
            'mini bar': 'fa-wine-glass-alt',
            'jacuzzi': 'fa-hot-tub-person',
            'work desk': 'fa-briefcase',
            'luxury bath': 'fa-bath',
            'butler service': 'fa-bell-concierge',
            'meeting area': 'fa-users',
            'personal outside dining space': 'fa-utensils',
        }

        result = []
        for item in self.get_amenities_list():
            key = item.lower()
            icon_class = icon_map.get(key, 'fa-circle')
            result.append((icon_class, item.strip()))
        return result
    
    
#---------------------------------------------------------------
# ROOM IMAGE MODEL HERE ---------------------------------------|
#---------------------------------------------------------------

class RoomImage(models.Model):
    room = models.ForeignKey(Room, related_name='images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='room_images/')

    def __str__(self):
        return f"Image for {self.room.name}"
    
    
#---------------------------------------------------------------
# FOOD MENU MODEL HERE ----------------------------------------|
#---------------------------------------------------------------
 
class Menu(models.Model):
    FOOD_TYPE = [
        ('vegetarian', 'Vegetarian'),
        ('non-vegetarian', 'Non-Vegetarian'),
    ]

    category = models.CharField(max_length=100)
    name = models.CharField(max_length=100)
    description = models.TextField(default='No description')
    price = models.PositiveIntegerField(default=0) 
    badge = models.TextField(blank = True)
    thumbnail = models.ImageField(upload_to='food_thumnail/', null=True, blank=True)
    type = models.CharField(max_length=50, choices=FOOD_TYPE)


#---------------------------------------------------------------
# GALLERY MODEL HERE --------------------------------------------|
#---------------------------------------------------------------

class images(models.Model):
    IMAGE_CATEGORY = [
        ('rooms', 'Rooms'),
        ('resturant', 'Resturant'),
        ('lobby', 'Lobby'),
        ('facilities', 'Facilities'),
        ('events', 'Events'),
    ]
    category = models.CharField(max_length=50, choices=IMAGE_CATEGORY)
    name = models.CharField(max_length=100)
    thumbnail = models.ImageField(upload_to='gallery_images/', null=True, blank=True)
    
#---------------------------------------------------------------
# ODER-ITEAM MODEL HERE ---------------------------------------|
#---------------------------------------------------------------

class Order(models.Model):
    ORDER_TYPES = (("food", "Food"), ("room", "Room"))
    STATUS = (("PENDING","Pending"), ("PAID","Paid"), ("FAILED","Failed"))

    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    order_type = models.CharField(max_length=10, choices=ORDER_TYPES)
    item_name = models.CharField(max_length=200)
    amount = models.DecimalField(max_digits=10, decimal_places=2)

    # For food
    quantity = models.PositiveIntegerField(default=1)

    # For room booking
    room = models.ForeignKey(Room, on_delete=models.SET_NULL, null=True, blank=True)
    check_in = models.DateField(null=True, blank=True)
    check_out = models.DateField(null=True, blank=True)
    guests = models.PositiveIntegerField(null=True, blank=True)

    # Payments
    status = models.CharField(max_length=10, choices=STATUS, default="PENDING")
    gateway = models.CharField(max_length=20, blank=True)  # 'esewa' or 'khalti'
    payment_reference = models.CharField(max_length=60, blank=True)  # e.g., refId / token
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.order_type} • {self.item_name} • {self.status}"
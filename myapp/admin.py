from django.contrib import admin
from .models import Room, RoomImage, Menu, images

class RoomImageInline(admin.TabularInline):
    model = RoomImage
    extra = 1

class RoomAdmin(admin.ModelAdmin):
    inlines = [RoomImageInline]

admin.site.register(Room, RoomAdmin)
admin.site.register(RoomImage)  
admin.site.register(Menu)
admin.site.register(images)
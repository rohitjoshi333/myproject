from django.contrib import admin
from .models import Room, RoomImage  # import RoomImage

class RoomImageInline(admin.TabularInline):
    model = RoomImage
    extra = 1

class RoomAdmin(admin.ModelAdmin):
    inlines = [RoomImageInline]

admin.site.register(Room, RoomAdmin)  # use RoomAdmin with inline images
admin.site.register(RoomImage)  # optional: lets you manage images directly if needed

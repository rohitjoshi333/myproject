from django.contrib import admin
from .models import feature
from .models import room
from .models import roomdetail
# Register your models here.
admin.site.register(feature)
admin.site.register(room)
admin.site.register(roomdetail)
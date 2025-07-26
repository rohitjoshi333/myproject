from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'), # when 'empty' it means root url or main site
    path('about/', views.about_view, name = 'about'),
    path('contact/', views.contact_view, name = 'contact'),
    path('events/', views.events_view, name = 'events'),
    path('gallery/', views.gallery_view, name = 'gallery'),
    path('menu/', views.menu_view, name = 'menu'),
    path('restaurant/', views.restaurant_view, name = 'restaurant'),
    path('roomdetails/', views.roomdetails_view, name = 'roomdetails'),
    path('rooms/', views.rooms_view, name = 'rooms'),
    path('register/', views.register, name = 'register'),
    path('login/', views.login, name = 'login'),
    path('logout/', views.logout, name = 'logout'),
    path('post/<str:pk>', views.post, name = 'post')
]


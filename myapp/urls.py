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
    path('post/<str:pk>', views.post, name = 'post'),
    
    # Menu + rooms pages (adjust if you already have)
    path("menu/", views.menu_view, name="menu"),
    path("room/<int:room_id>/", views.room_detail, name="room_detail"),

    # Create orders
    path("order/food/", views.create_food_order, name="create_food_order"),
    path("order/room/", views.create_room_order, name="create_room_order"),

    # Payment picker
    path("pay/<int:order_id>/", views.payment_select, name="payment_select"),

    # eSewa
    path("esewa/init/<int:order_id>/", views.esewa_init, name="esewa_init"),
    path("esewa/callback/success/", views.esewa_success, name="esewa_success"),
    path("esewa/callback/failure/", views.esewa_failure, name="esewa_failure"),

    # Khalti
    path("khalti/verify/", views.khalti_verify, name="khalti_verify"),

    # Result pages
    path("payment/success/<int:order_id>/", views.payment_success, name="payment_success"),
    path("payment/failure/<int:order_id>/", views.payment_failure, name="payment_failure"),
]
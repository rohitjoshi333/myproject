from django import forms
from .models import Room

class FoodOrderForm(forms.Form):
    food_id = forms.IntegerField(widget=forms.HiddenInput())
    quantity = forms.IntegerField(min_value=1, initial=1)
    note = forms.CharField(required=False, widget=forms.Textarea(attrs={"rows":2}))

class RoomBookingForm(forms.Form):
    room_id = forms.IntegerField(widget=forms.HiddenInput())
    full_name = forms.CharField()
    email = forms.EmailField()
    phone = forms.CharField()
    check_in = forms.DateField(widget=forms.DateInput(attrs={"type":"date"}))
    check_out = forms.DateField(widget=forms.DateInput(attrs={"type":"date"}))
    guests = forms.IntegerField(min_value=1, initial=1)

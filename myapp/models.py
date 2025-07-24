from django.db import models

# Create your models here.
class feature(models.Model):
    name= models.CharField(max_length=100)
    details= models.CharField(max_length=200)
    price= models.CharField(max_length=100)
    image= models.CharField(max_length=200)

class room(models.Model):
    category = models.CharField(max_length=100)
    name = models.CharField(max_length=100)
    description = models.CharField(max_length=500)
    price = models.CharField(max_length=100)
    guest_count = models.CharField(max_length=100)
    aminities = models.CharField(max_length=500)
    image = models.CharField(max_length=200)
    status = models.CharField(max_length=100)

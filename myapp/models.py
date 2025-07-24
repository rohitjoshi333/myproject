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

class roomdetail(models.Model):
    category = models.CharField(max_length=100, unique=True)  # unique so we can use for filtering
    name = models.CharField(max_length=100)
    description = models.TextField()
    price = models.CharField(max_length=100)
    guest_count = models.CharField(max_length=100)
    amenities = models.TextField()  # comma-separated
    images = models.TextField()     # comma-separated
    status = models.CharField(max_length=100)

    def get_amenities_list(self):
        return [a.strip() for a in self.amenities.split(',') if a.strip()]

    def get_images_list(self):
        return [img.strip() for img in self.images.split(',') if img.strip()]

    def __str__(self):
        return self.name

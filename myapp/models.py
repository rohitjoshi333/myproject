from django.db import models

# Create your models here.
class feature:
    id: int
    name: str
    details: str
    price: str
    image: str

class room:
    id: int
    category: str
    name: str
    description: str
    price: str
    guest_count: str
    aminities: str
    image: str
    status: str

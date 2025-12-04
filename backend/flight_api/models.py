from django.db import models

class Booking(models.Model):
    booking_code = models.CharField(max_length=20, unique=True) 
    airline = models.CharField(max_length=100)
    origin = models.CharField(max_length=10)
    destination = models.CharField(max_length=10)
    departure_time = models.DateTimeField()
    price = models.DecimalField(max_digits=15, decimal_places=2)
    passenger_name = models.CharField(max_length=100)
    passport_number = models.CharField(max_length=50)
    email = models.EmailField()
    gender = models.CharField(max_length=10, default='MALE')
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return f"{self.booking_code} - {self.passenger_name}"
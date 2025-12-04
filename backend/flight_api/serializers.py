from rest_framework import serializers
from .models import Booking
from rest_framework.decorators import api_view
from rest_framework.response import Response
class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = '__all__'

@api_view(['GET'])
def get_booking_history(request):
    bookings = Booking.objects.all().order_by('-created_at')
    
    serializer = BookingSerializer(bookings, many=True)
    
    # Kirim ke React
    return Response(serializer.data)
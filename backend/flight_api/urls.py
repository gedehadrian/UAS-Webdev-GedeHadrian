from django.urls import path
from . import views

urlpatterns = [
    path('search-flights', views.search_flights, name='search_flights'),
    path('book-amadeus', views.book_flight_amadeus, name='book_flight'),
]
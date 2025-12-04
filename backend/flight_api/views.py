from django.conf import settings
from rest_framework.decorators import api_view
from rest_framework.response import Response
from amadeus import Client, ResponseError
from .models import Booking
import requests
import traceback

amadeus = Client(
    client_id=settings.AMADEUS_CLIENT_ID,
    client_secret=settings.AMADEUS_CLIENT_SECRET
)

# Base URL for Amadeus API
AMADEUS_BASE_URL = "https://test.api.amadeus.com"


def get_amadeus_token():
    """Get access token from Amadeus"""
    url = f"{AMADEUS_BASE_URL}/v1/security/oauth2/token"
    data = {
        'grant_type': 'client_credentials',
        'client_id': settings.AMADEUS_CLIENT_ID,
        'client_secret': settings.AMADEUS_CLIENT_SECRET
    }
    response = requests.post(url, data=data)
    print("Token Response:", response.status_code)
    return response.json()['access_token']


@api_view(['GET'])
def search_flights(request):
    origin = request.GET.get('origin')
    destination = request.GET.get('destination')
    departure_date = request.GET.get('departureDate')
    adults = request.GET.get('adults', 1)

    if not origin or not destination or not departure_date:
        return Response({'error': 'Mohon lengkapi Origin, Destination, dan Tanggal!'}, status=400)

    try:
        response = amadeus.shopping.flight_offers_search.get(
            originLocationCode=origin,
            destinationLocationCode=destination,
            departureDate=departure_date,
            adults=adults,
            max=10  
        )
        return Response({'results': response.data})

    except ResponseError as error:
        print(f"Amadeus Error: {error}")
        return Response({'error': 'Gagal mencari penerbangan. Cek kuota API atau rute.'}, status=400)


@api_view(['POST'])
def book_flight_amadeus(request):
    try:
        print("\n" + "="*50)
        print("BOOKING REQUEST RECEIVED")
        print("="*50)
        
        flight_offer = request.data.get('flight_offer') 
        traveler_data = request.data.get('traveler')   

        if not flight_offer or not traveler_data:
            return Response({'error': 'Data Penerbangan atau Penumpang kurang lengkap'}, status=400)

        # Get passengers list from frontend
        passengers_list = traveler_data.get('passengers', [])
        
        # Fallback for old format (single passenger)
        if not passengers_list:
            passengers_list = [{
                'id': 1,
                'fullName': traveler_data.get('fullName', ''),
                'passportNumber': traveler_data.get('passportNumber', ''),
                'email': traveler_data.get('email', ''),
                'gender': traveler_data.get('gender', 'MALE')
            }]
        
        num_travelers = len(flight_offer.get('travelerPricings', []))
        print(f"Passengers from frontend: {len(passengers_list)}")
        print(f"Travelers in flight offer: {num_travelers}")

        # Get fresh token
        print("\n[STEP 1] Getting Amadeus Token...")
        token = get_amadeus_token()
        print(f"Token received: {token[:20]}...")
        
        headers = {
            'Authorization': f'Bearer {token}',
            'Content-Type': 'application/json'
        }

        # === STEP 2: Flight Offers Pricing ===
        print("\n[STEP 2] Calling Flight Offers Pricing...")
        pricing_url = f"{AMADEUS_BASE_URL}/v1/shopping/flight-offers/pricing"
        pricing_body = {
            'data': {
                'type': 'flight-offers-pricing',
                'flightOffers': [flight_offer]
            }
        }
        
        pricing_response = requests.post(pricing_url, headers=headers, json=pricing_body)
        print(f"Pricing Status: {pricing_response.status_code}")
        
        if pricing_response.status_code != 200:
            print(f"Pricing Error: {pricing_response.text}")
            return Response({
                'error': 'Gagal validasi harga. Silakan coba flight lain atau tanggal berbeda.'
            }, status=400)
        
        pricing_data = pricing_response.json()
        validated_offer = pricing_data['data']['flightOffers'][0]
        print("Pricing validated successfully!")

        # === BUILD TRAVELERS LIST FOR AMADEUS ===
        travelers_for_amadeus = []
        
        for i in range(num_travelers):
            if i < len(passengers_list):
                pax = passengers_list[i]
            else:
                pax = passengers_list[0]
            
            # Parse name
            names = pax['fullName'].strip().split(' ')
            first_name = names[0].upper()
            last_name = " ".join(names[1:]).upper() if len(names) > 1 else "UNKNOWN"
            
            traveler_payload = {
                "id": str(i + 1),
                "dateOfBirth": "1990-01-01",
                "name": {
                    "firstName": first_name,
                    "lastName": last_name
                },
                "gender": pax.get('gender', 'MALE'),
                "contact": {
                    "emailAddress": pax['email'],
                    "phones": [{
                        "deviceType": "MOBILE",
                        "countryCallingCode": "62",
                        "number": "8123456789"
                    }]
                },
                "documents": [{
                    "documentType": "PASSPORT",
                    "birthPlace": "Jakarta",
                    "issuanceLocation": "Jakarta",
                    "issuanceDate": "2020-01-01",
                    "number": pax['passportNumber'],
                    "expiryDate": "2030-01-01",
                    "issuanceCountry": "ID",
                    "validityCountry": "ID",
                    "nationality": "ID",
                    "holder": True
                }]
            }
            travelers_for_amadeus.append(traveler_payload)
            print(f"Traveler {i+1}: {first_name} {last_name}")

        # === STEP 3: Create Flight Order ===
        print(f"\n[STEP 3] Creating Flight Order with {len(travelers_for_amadeus)} travelers...")
        order_url = f"{AMADEUS_BASE_URL}/v1/booking/flight-orders"
        order_body = {
            'data': {
                'type': 'flight-order',
                'flightOffers': [validated_offer],
                'travelers': travelers_for_amadeus
            }
        }

        order_response = requests.post(order_url, headers=headers, json=order_body)
        print(f"Order Status: {order_response.status_code}")
        
        if order_response.status_code not in [200, 201]:
            error_data = order_response.json()
            error_detail = error_data.get('errors', [{}])[0].get('detail', 'Unknown error')
            print(f"Order Error: {error_detail}")
            
            # User-friendly error messages
            if 'SEGMENT SELL FAILURE' in str(error_data):
                error_msg = 'Kursi untuk penerbangan ini sudah tidak tersedia. Silakan pilih penerbangan lain.'
            elif 'schedule change' in str(error_data).lower():
                error_msg = 'Jadwal penerbangan telah berubah. Silakan search ulang untuk mendapatkan data terbaru.'
            else:
                error_msg = f'Gagal membuat booking: {error_detail}'
            
            return Response({'error': error_msg}, status=400)

        order_data = order_response.json()
        amadeus_pnr = order_data['data']['id']
        print(f"✅ Booking SUCCESS! PNR: {amadeus_pnr}")

        # Get flight details
        itinerary = validated_offer['itineraries'][0]['segments'][0]
        
        # === STEP 4: Save to Database ===
        print("\n[STEP 4] Saving to database...")
        
        primary_pax = passengers_list[0]
        booking = Booking.objects.create(
            booking_code=amadeus_pnr, 
            airline=itinerary['carrierCode'],
            origin=itinerary['departure']['iataCode'],
            destination=itinerary['arrival']['iataCode'],
            departure_time=itinerary['departure']['at'],
            price=validated_offer['price']['total'],
            passenger_name=primary_pax['fullName'],
            passport_number=primary_pax['passportNumber'],
            email=primary_pax['email']
        )
        print(f"✅ Saved to DB with ID: {booking.id}")

        print("\n" + "="*50)
        print("🎉 BOOKING COMPLETED SUCCESSFULLY!")
        print(f"📋 Booking Code: {amadeus_pnr}")
        print("="*50 + "\n")

        return Response({
            'status': 'success',
            'booking_code': amadeus_pnr,
            'message': f'Booking Berhasil untuk {num_travelers} penumpang!'
        })

    except Exception as e:
        print("\n" + "="*50)
        print("❌ ERROR OCCURRED!")
        print("="*50)
        print(f"Error Type: {type(e).__name__}")
        print(f"Error Message: {str(e)}")
        traceback.print_exc()
        print("="*50 + "\n")
        return Response({'error': str(e)}, status=500)
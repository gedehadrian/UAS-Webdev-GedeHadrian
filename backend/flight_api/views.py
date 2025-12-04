from django.conf import settings
from rest_framework.decorators import api_view
from rest_framework.response import Response
from amadeus import Client, ResponseError
from .models import Booking
import requests
import traceback

AMADEUS_BASE_URL = "https://test.api.amadeus.com"

amadeus = Client(
    client_id=settings.AMADEUS_CLIENT_ID,
    client_secret=settings.AMADEUS_CLIENT_SECRET
)


def get_amadeus_token():
    url = f"{AMADEUS_BASE_URL}/v1/security/oauth2/token"
    data = {
        'grant_type': 'client_credentials',
        'client_id': settings.AMADEUS_CLIENT_ID,
        'client_secret': settings.AMADEUS_CLIENT_SECRET
    }
    response = requests.post(url, data=data)
    return response.json()['access_token']


@api_view(['GET'])
def search_flights(request):
    origin = request.GET.get('origin')
    destination = request.GET.get('destination')
    departure_date = request.GET.get('departureDate')
    return_date = request.GET.get('returnDate')  # ← Ambil returnDate
    adults = request.GET.get('adults', 1)

    if not origin or not destination or not departure_date:
        return Response({'error': 'Mohon lengkapi Origin, Destination, dan Tanggal!'}, status=400)

    try:
        # Build search parameters
        search_params = {
            'originLocationCode': origin,
            'destinationLocationCode': destination,
            'departureDate': departure_date,
            'adults': adults,
            'max': 10
        }
        
        # Add return date for round trip
        if return_date:
            search_params['returnDate'] = return_date
            print(f"Round Trip Search: {origin} → {destination}, {departure_date} - {return_date}")
        else:
            print(f"One Way Search: {origin} → {destination}, {departure_date}")
        
        response = amadeus.shopping.flight_offers_search.get(**search_params)
        
        print(f"Found {len(response.data)} flight offers")
        
        return Response({'results': response.data})

    except ResponseError as error:
        print(f"Amadeus Search Error: {error}")
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

        passengers_list = traveler_data.get('passengers', [])
        
        if not passengers_list:
            passengers_list = [{
                'id': 1,
                'fullName': traveler_data.get('fullName', ''),
                'passportNumber': traveler_data.get('passportNumber', ''),
                'email': traveler_data.get('email', ''),
                'gender': traveler_data.get('gender', 'MALE')
            }]
        
        num_travelers = len(flight_offer.get('travelerPricings', []))
        
        # Check if round trip (has 2 itineraries)
        num_itineraries = len(flight_offer.get('itineraries', []))
        is_round_trip = num_itineraries == 2
        
        print(f"Passengers: {len(passengers_list)}")
        print(f"Trip Type: {'Round Trip' if is_round_trip else 'One Way'}")
        print(f"Itineraries: {num_itineraries}")

        print("\n[STEP 1] Getting Amadeus Token...")
        token = get_amadeus_token()
        print(f"Token received: {token[:10]}...******")
        
        headers = {
            'Authorization': f'Bearer {token}',
            'Content-Type': 'application/json'
        }

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
                'error': 'Harga berubah atau penerbangan tidak tersedia. Silakan cari ulang.'
            }, status=400)
        
        pricing_data = pricing_response.json()
        validated_offer = pricing_data['data']['flightOffers'][0]
        print("Pricing validated successfully!")

        travelers_for_amadeus = []
        
        for i in range(num_travelers):
            if i < len(passengers_list):
                pax = passengers_list[i]
            else:
                pax = passengers_list[0]
            
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

        print(f"\n[STEP 3] Creating Flight Order...")
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
            try:
                error_detail = error_data.get('errors', [{}])[0].get('detail', 'Unknown error')
            except:
                error_detail = str(error_data)

            if 'SEGMENT SELL FAILURE' in str(error_data):
                error_msg = 'Kursi habis. Silakan pilih penerbangan lain.'
            else:
                error_msg = f'Gagal Booking: {error_detail}'
            
            return Response({'error': error_msg}, status=400)

        order_data = order_response.json()
        amadeus_pnr = order_data['data']['id']
        print(f"Booking SUCCESS! PNR: {amadeus_pnr}")

        print("\n[STEP 4] Saving to database...")
        
        # Get outbound flight info
        outbound = validated_offer['itineraries'][0]['segments'][0]
        
        # Get return flight info if round trip
        if is_round_trip:
            return_flight = validated_offer['itineraries'][1]['segments'][0]
            destination_code = return_flight['departure']['iataCode']
            print(f"Round Trip: {outbound['departure']['iataCode']} ↔ {destination_code}")
        else:
            last_segment = validated_offer['itineraries'][0]['segments'][-1]
            destination_code = last_segment['arrival']['iataCode']
        
        primary_pax = passengers_list[0]
        
        booking = Booking.objects.create(
            booking_code=amadeus_pnr, 
            airline=outbound['carrierCode'],
            origin=outbound['departure']['iataCode'],
            destination=destination_code,
            departure_time=outbound['departure']['at'],
            price=validated_offer['price']['total'],
            passenger_name=primary_pax['fullName'],
            passport_number=primary_pax['passportNumber'],
            email=primary_pax['email']
        )
        print(f"Saved to DB with ID: {booking.id}")

        print("\n" + "="*50)
        print("BOOKING COMPLETED!")
        print("="*50 + "\n")

        trip_type = "Round Trip" if is_round_trip else "One Way"
        return Response({
            'status': 'success',
            'booking_code': amadeus_pnr,
            'message': f'Booking {trip_type} Berhasil! Kode: {amadeus_pnr}'
        })

    except Exception as e:
        print("\n" + "="*50)
        print("CRITICAL ERROR")
        print("="*50)
        traceback.print_exc()
        return Response({'error': str(e)}, status=500)
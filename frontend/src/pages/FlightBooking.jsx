import { useState } from "react";

function FlightBooking({ flight, onBook, onBack, loading, searchParams }) {
  const numPassengers = flight.travelerPricings?.length || 1;
  const isRoundTrip = flight.itineraries?.length === 2;

  const [passengers, setPassengers] = useState(() => {
    return Array.from({ length: numPassengers }, (_, index) => ({
      id: index + 1,
      fullName: "",
      passportNumber: "",
      email: "",
      gender: "MALE",
    }));
  });

  // Outbound flight info
  const outbound = flight.itineraries[0];
  const outboundSegment = outbound.segments[0];
  const outboundLastSegment = outbound.segments[outbound.segments.length - 1];

  // Return flight info (if round trip)
  const returnFlight = flight.itineraries[1];
  const returnSegment = returnFlight?.segments[0];
  const returnLastSegment =
    returnFlight?.segments[returnFlight?.segments.length - 1];

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatPrice = (price, currency) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: currency || "EUR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handlePassengerChange = (index, field, value) => {
    setPassengers((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onBook({
      passengers: passengers,
      fullName: passengers[0].fullName,
      passportNumber: passengers[0].passportNumber,
      email: passengers[0].email,
    });
  };

  const isFormValid = () => {
    return passengers.every(
      (p) =>
        p.fullName.trim() !== "" &&
        p.passportNumber.trim() !== "" &&
        p.email.trim() !== ""
    );
  };

  // Flight segment component
  const FlightSegment = ({ segment, lastSegment, type = "outbound" }) => {
    const isOutbound = type === "outbound";
    const colorClass = isOutbound ? "blue" : "purple";

    return (
      <div
        className={`p-4 rounded-xl ${
          isOutbound ? "bg-slate-800/30" : "bg-purple-900/10"
        }`}
      >
        <div className="flex items-center gap-2 mb-3">
          <span
            className={`px-2 py-1 bg-${colorClass}-500/10 text-${colorClass}-400 text-xs font-medium rounded-full flex items-center gap-1`}
          >
            <i
              className={`fa-solid fa-plane-${
                isOutbound ? "departure" : "arrival"
              }`}
            ></i>
            {isOutbound ? "Outbound" : "Return"}
          </span>
          <span className="text-slate-500 text-xs">
            {formatDate(segment.departure.at)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-semibold text-white">
              {segment.departure.iataCode}
            </p>
            <p className="text-slate-400 text-sm flex items-center gap-1">
              <i className="fa-regular fa-clock text-xs"></i>
              {formatTime(segment.departure.at)}
            </p>
          </div>

          <div className="flex-1 flex items-center justify-center px-4">
            <div className={`w-2 h-2 rounded-full bg-${colorClass}-500`} />
            <div
              className={`flex-1 h-px bg-gradient-to-r from-${colorClass}-500 to-${colorClass}-400 mx-2 relative`}
            >
              <i
                className={`fa-solid fa-plane absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-${colorClass}-400 bg-slate-900 px-1 text-xs`}
              ></i>
            </div>
            <div className={`w-2 h-2 rounded-full bg-${colorClass}-500`} />
          </div>

          <div className="text-right">
            <p className="text-2xl font-semibold text-white">
              {lastSegment.arrival.iataCode}
            </p>
            <p className="text-slate-400 text-sm flex items-center gap-1 justify-end">
              <i className="fa-regular fa-clock text-xs"></i>
              {formatTime(lastSegment.arrival.at)}
            </p>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-4 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <i className="fa-solid fa-plane"></i>
            {segment.carrierCode} {segment.number}
          </span>
          <span className="flex items-center gap-1">
            <i className="fa-solid fa-ticket"></i>
            {flight.travelerPricings[0].fareDetailsBySegment[0].cabin}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 text-slate-400 hover:text-white transition-colors mb-8 group"
        >
          <i className="fa-solid fa-arrow-left group-hover:-translate-x-1 transition-transform"></i>
          <span>Back to Results</span>
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Flight Summary - Left Side */}
          <div className="lg:col-span-1">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
              <i className="fa-solid fa-plane-departure text-blue-400"></i>
              Flight Details
              {isRoundTrip && (
                <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full">
                  Round Trip
                </span>
              )}
            </h2>

            <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 sticky top-6 space-y-4">
              {/* Outbound Flight */}
              <FlightSegment
                segment={outboundSegment}
                lastSegment={outboundLastSegment}
                type="outbound"
              />

              {/* Return Flight */}
              {isRoundTrip && returnSegment && (
                <FlightSegment
                  segment={returnSegment}
                  lastSegment={returnLastSegment}
                  type="return"
                />
              )}

              {/* Details */}
              <div className="space-y-3 pt-4 border-t border-slate-800">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 flex items-center gap-2">
                    <i className="fa-solid fa-users"></i>
                    Passengers
                  </span>
                  <span className="text-white">
                    {numPassengers} Adult{numPassengers > 1 ? "s" : ""}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 flex items-center gap-2">
                    <i className="fa-solid fa-route"></i>
                    Trip Type
                  </span>
                  <span className="text-white">
                    {isRoundTrip ? "Round Trip" : "One Way"}
                  </span>
                </div>
              </div>

              {/* Price */}
              <div className="flex justify-between items-center pt-4 border-t border-slate-800">
                <span className="text-slate-400 flex items-center gap-2">
                  <i className="fa-solid fa-receipt"></i>
                  Total Price
                </span>
                <span className="text-2xl font-semibold text-blue-400">
                  {formatPrice(flight.price.total, flight.price.currency)}
                </span>
              </div>
            </div>
          </div>

          {/* Passenger Forms - Right Side */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
              <i className="fa-solid fa-user-group text-blue-400"></i>
              Passenger Information
              <span className="text-slate-500 font-normal text-base">
                ({numPassengers} passenger{numPassengers > 1 ? "s" : ""})
              </span>
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {passengers.map((passenger, index) => (
                <div
                  key={index}
                  className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
                      <i className="fa-solid fa-user text-blue-400"></i>
                    </div>
                    <div>
                      <h3 className="text-white font-medium">
                        Passenger {index + 1}
                      </h3>
                      <p className="text-slate-500 text-sm">Adult</p>
                    </div>
                    {index === 0 && (
                      <span className="ml-auto px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-xs flex items-center gap-1">
                        <i className="fa-solid fa-star text-[10px]"></i>
                        Primary Contact
                      </span>
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="md:col-span-2 space-y-2">
                      <label className="block text-sm font-medium text-slate-300">
                        <i className="fa-solid fa-id-card mr-2 text-slate-500"></i>
                        Full Name{" "}
                        <span className="text-slate-500">(as in passport)</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="John Doe"
                          value={passenger.fullName}
                          onChange={(e) =>
                            handlePassengerChange(
                              index,
                              "fullName",
                              e.target.value
                            )
                          }
                          required
                          className="w-full pl-11 pr-4 py-3.5 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200"
                        />
                        <i className="fa-solid fa-user absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"></i>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-slate-300">
                        <i className="fa-solid fa-passport mr-2 text-slate-500"></i>
                        Passport Number
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="A12345678"
                          value={passenger.passportNumber}
                          onChange={(e) =>
                            handlePassengerChange(
                              index,
                              "passportNumber",
                              e.target.value
                            )
                          }
                          required
                          className="w-full pl-11 pr-4 py-3.5 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200"
                        />
                        <i className="fa-solid fa-passport absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"></i>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-slate-300">
                        <i className="fa-solid fa-venus-mars mr-2 text-slate-500"></i>
                        Gender
                      </label>
                      <div className="relative">
                        <select
                          value={passenger.gender}
                          onChange={(e) =>
                            handlePassengerChange(
                              index,
                              "gender",
                              e.target.value
                            )
                          }
                          className="w-full pl-11 pr-4 py-3.5 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200 appearance-none"
                        >
                          <option value="MALE">Male</option>
                          <option value="FEMALE">Female</option>
                        </select>
                        <i className="fa-solid fa-venus-mars absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"></i>
                        <i className="fa-solid fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm"></i>
                      </div>
                    </div>

                    <div className="md:col-span-2 space-y-2">
                      <label className="block text-sm font-medium text-slate-300">
                        <i className="fa-solid fa-envelope mr-2 text-slate-500"></i>
                        Email Address
                        {index === 0 && (
                          <span className="text-slate-500 ml-1">
                            (for booking confirmation)
                          </span>
                        )}
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          placeholder="john@example.com"
                          value={passenger.email}
                          onChange={(e) =>
                            handlePassengerChange(
                              index,
                              "email",
                              e.target.value
                            )
                          }
                          required
                          className="w-full pl-11 pr-4 py-3.5 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200"
                        />
                        <i className="fa-solid fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"></i>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Price Summary */}
              <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6">
                <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                  <i className="fa-solid fa-calculator text-blue-400"></i>
                  Price Summary
                </h3>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-slate-400">Price per person</span>
                  <span className="text-white">
                    {formatPrice(
                      flight.travelerPricings[0].price.total,
                      flight.price.currency
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-slate-400">Passengers</span>
                  <span className="text-white">× {numPassengers}</span>
                </div>
                {isRoundTrip && (
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-slate-400">Trip Type</span>
                    <span className="text-purple-400 flex items-center gap-1">
                      <i className="fa-solid fa-arrow-right-arrow-left"></i>
                      Round Trip
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-4 border-t border-slate-800">
                  <span className="text-white font-medium flex items-center gap-2">
                    <i className="fa-solid fa-wallet text-green-400"></i>
                    Total
                  </span>
                  <span className="text-2xl font-semibold text-blue-400">
                    {formatPrice(flight.price.total, flight.price.currency)}
                  </span>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || !isFormValid()}
                className="w-full py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-slate-700 disabled:to-slate-700 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-all duration-200 flex items-center justify-center gap-3 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 disabled:shadow-none"
              >
                {loading ? (
                  <i className="fa-solid fa-spinner fa-spin text-xl"></i>
                ) : (
                  <>
                    <i className="fa-solid fa-check-circle"></i>
                    <span>Confirm Booking</span>
                    <i className="fa-solid fa-arrow-right"></i>
                  </>
                )}
              </button>

              <p className="text-center text-slate-500 text-sm flex items-center justify-center gap-2">
                <i className="fa-solid fa-shield-halved text-green-500"></i>
                Your payment information is secure and encrypted
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FlightBooking;

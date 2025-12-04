function FlightResults({ flights, onSelectFlight, onBack, searchParams }) {
  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
    });
  };

  const formatPrice = (price, currency) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: currency || "EUR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const calculateDuration = (segments) => {
    const departure = new Date(segments[0].departure.at);
    const arrival = new Date(segments[segments.length - 1].arrival.at);
    const diff = arrival - departure;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  // Check if flights are round trip (have 2 itineraries)
  const isRoundTrip =
    flights.length > 0 && flights[0].itineraries?.length === 2;

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 text-slate-400 hover:text-white transition-colors group"
          >
            <i className="fa-solid fa-arrow-left group-hover:-translate-x-1 transition-transform"></i>
            <span>Back</span>
          </button>
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-white flex items-center justify-center gap-2">
              <i className="fa-solid fa-plane text-blue-400"></i>
              Available Flights
            </h1>
            <p className="text-slate-400 text-sm mt-1 flex items-center justify-center gap-2">
              <span>{flights.length} results found</span>
              {isRoundTrip && (
                <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 text-xs rounded-full">
                  <i className="fa-solid fa-arrow-right-arrow-left mr-1"></i>
                  Round Trip
                </span>
              )}
            </p>
          </div>
          <div className="w-20" />
        </div>

        {/* Flight List */}
        <div className="space-y-4">
          {flights.map((flight, index) => {
            const outbound = flight.itineraries[0];
            const outboundSegment = outbound.segments[0];
            const outboundLastSegment =
              outbound.segments[outbound.segments.length - 1];
            const outboundStops = outbound.segments.length - 1;

            // Return flight (if round trip)
            const returnFlight = flight.itineraries[1];
            const returnSegment = returnFlight?.segments[0];
            const returnLastSegment =
              returnFlight?.segments[returnFlight.segments.length - 1];
            const returnStops = returnFlight
              ? returnFlight.segments.length - 1
              : 0;

            return (
              <div
                key={index}
                className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-all duration-300"
              >
                {/* Outbound Flight */}
                <div className="p-6">
                  {isRoundTrip && (
                    <div className="flex items-center gap-2 mb-4">
                      <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-xs font-medium rounded-full flex items-center gap-1">
                        <i className="fa-solid fa-plane-departure"></i>
                        Outbound
                      </span>
                      <span className="text-slate-500 text-sm">
                        {formatDate(outboundSegment.departure.at)}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-6">
                    {/* Airline */}
                    <div className="flex items-center gap-4 min-w-[120px]">
                      <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                        <span className="text-blue-400 font-semibold">
                          {outboundSegment.carrierCode}
                        </span>
                      </div>
                      <div>
                        <p className="text-white font-medium">
                          {outboundSegment.carrierCode}
                        </p>
                        <p className="text-slate-500 text-sm">
                          {outboundSegment.number}
                        </p>
                      </div>
                    </div>

                    {/* Route */}
                    <div className="flex-1 flex items-center justify-center gap-4">
                      {/* Departure */}
                      <div className="text-right">
                        <p className="text-xl font-semibold text-white">
                          {formatTime(outboundSegment.departure.at)}
                        </p>
                        <p className="text-slate-400">
                          {outboundSegment.departure.iataCode}
                        </p>
                        {!isRoundTrip && (
                          <p className="text-slate-500 text-sm">
                            {formatDate(outboundSegment.departure.at)}
                          </p>
                        )}
                      </div>

                      {/* Path */}
                      <div className="flex-1 max-w-[200px] flex flex-col items-center gap-1">
                        <span className="text-xs text-slate-500">
                          {calculateDuration(outbound.segments)}
                        </span>
                        <div className="w-full flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-blue-500" />
                          <div className="flex-1 h-px bg-gradient-to-r from-blue-500 to-blue-400" />
                          <i className="fa-solid fa-plane text-blue-400 text-xs"></i>
                          <div className="flex-1 h-px bg-gradient-to-r from-blue-400 to-blue-500" />
                          <div className="w-2 h-2 rounded-full bg-blue-500" />
                        </div>
                        <span className="text-xs text-slate-500">
                          {outboundStops === 0
                            ? "Direct"
                            : `${outboundStops} stop${
                                outboundStops > 1 ? "s" : ""
                              }`}
                        </span>
                      </div>

                      {/* Arrival */}
                      <div className="text-left">
                        <p className="text-xl font-semibold text-white">
                          {formatTime(outboundLastSegment.arrival.at)}
                        </p>
                        <p className="text-slate-400">
                          {outboundLastSegment.arrival.iataCode}
                        </p>
                        {!isRoundTrip && (
                          <p className="text-slate-500 text-sm">
                            {formatDate(outboundLastSegment.arrival.at)}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Price (only show if one way) */}
                    {!isRoundTrip && (
                      <div className="text-right min-w-[150px]">
                        <p className="text-2xl font-semibold text-white">
                          {formatPrice(
                            flight.price.total,
                            flight.price.currency
                          )}
                        </p>
                        <p className="text-slate-500 text-sm mb-3">/person</p>
                        <button
                          onClick={() => onSelectFlight(flight)}
                          className="px-6 py-2.5 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 flex items-center gap-2"
                        >
                          <span>Select</span>
                          <i className="fa-solid fa-arrow-right"></i>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Return Flight (if round trip) */}
                {isRoundTrip && returnFlight && (
                  <>
                    <div className="border-t border-slate-800 border-dashed" />

                    <div className="p-6 bg-slate-900/30">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="px-3 py-1 bg-purple-500/10 text-purple-400 text-xs font-medium rounded-full flex items-center gap-1">
                          <i className="fa-solid fa-plane-arrival"></i>
                          Return
                        </span>
                        <span className="text-slate-500 text-sm">
                          {formatDate(returnSegment.departure.at)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-6">
                        {/* Airline */}
                        <div className="flex items-center gap-4 min-w-[120px]">
                          <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                            <span className="text-purple-400 font-semibold">
                              {returnSegment.carrierCode}
                            </span>
                          </div>
                          <div>
                            <p className="text-white font-medium">
                              {returnSegment.carrierCode}
                            </p>
                            <p className="text-slate-500 text-sm">
                              {returnSegment.number}
                            </p>
                          </div>
                        </div>

                        {/* Route */}
                        <div className="flex-1 flex items-center justify-center gap-4">
                          <div className="text-right">
                            <p className="text-xl font-semibold text-white">
                              {formatTime(returnSegment.departure.at)}
                            </p>
                            <p className="text-slate-400">
                              {returnSegment.departure.iataCode}
                            </p>
                          </div>

                          <div className="flex-1 max-w-[200px] flex flex-col items-center gap-1">
                            <span className="text-xs text-slate-500">
                              {calculateDuration(returnFlight.segments)}
                            </span>
                            <div className="w-full flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-purple-500" />
                              <div className="flex-1 h-px bg-gradient-to-r from-purple-500 to-purple-400" />
                              <i className="fa-solid fa-plane text-purple-400 text-xs"></i>
                              <div className="flex-1 h-px bg-gradient-to-r from-purple-400 to-purple-500" />
                              <div className="w-2 h-2 rounded-full bg-purple-500" />
                            </div>
                            <span className="text-xs text-slate-500">
                              {returnStops === 0
                                ? "Direct"
                                : `${returnStops} stop${
                                    returnStops > 1 ? "s" : ""
                                  }`}
                            </span>
                          </div>

                          <div className="text-left">
                            <p className="text-xl font-semibold text-white">
                              {formatTime(returnLastSegment.arrival.at)}
                            </p>
                            <p className="text-slate-400">
                              {returnLastSegment.arrival.iataCode}
                            </p>
                          </div>
                        </div>

                        {/* Price & Action */}
                        <div className="text-right min-w-[150px]">
                          <p className="text-slate-400 text-xs mb-1">
                            Total Round Trip
                          </p>
                          <p className="text-2xl font-semibold text-white">
                            {formatPrice(
                              flight.price.total,
                              flight.price.currency
                            )}
                          </p>
                          <p className="text-slate-500 text-sm mb-3">/person</p>
                          <button
                            onClick={() => onSelectFlight(flight)}
                            className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white text-sm font-medium rounded-xl transition-all duration-200 shadow-lg hover:shadow-purple-500/25 flex items-center gap-2"
                          >
                            <span>Select</span>
                            <i className="fa-solid fa-arrow-right"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {flights.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-full bg-slate-800/50 flex items-center justify-center mx-auto mb-6">
              <i className="fa-solid fa-plane-slash text-3xl text-slate-500"></i>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No flights found
            </h3>
            <p className="text-slate-400 mb-6">
              Try different dates or destinations
            </p>
            <button
              onClick={onBack}
              className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-xl transition-colors"
            >
              <i className="fa-solid fa-arrow-left mr-2"></i>
              Back to Search
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default FlightResults;

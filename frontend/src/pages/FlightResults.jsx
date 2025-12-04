function FlightResults({ flights, onSelectFlight, onBack }) {
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
      currency: currency || "IDR",
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

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 text-slate-400 hover:text-white transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span>Back</span>
          </button>
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-white">
              Available Flights
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              {flights.length} results found
            </p>
          </div>
          <div className="w-20" /> {/* Spacer for alignment */}
        </div>

        {/* Flight List */}
        <div className="space-y-4">
          {flights.map((flight, index) => {
            const segment = flight.itineraries[0].segments[0];
            const lastSegment =
              flight.itineraries[0].segments[
                flight.itineraries[0].segments.length - 1
              ];
            const stops = flight.itineraries[0].segments.length - 1;

            return (
              <div
                key={index}
                className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-all duration-300 group"
              >
                <div className="flex items-center justify-between gap-6">
                  {/* Airline */}
                  <div className="flex items-center gap-4 min-w-[120px]">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                      <span className="text-blue-400 font-semibold">
                        {segment.carrierCode}
                      </span>
                    </div>
                    <div>
                      <p className="text-white font-medium">
                        {segment.carrierCode}
                      </p>
                      <p className="text-slate-500 text-sm">{segment.number}</p>
                    </div>
                  </div>

                  {/* Route */}
                  <div className="flex-1 flex items-center justify-center gap-4">
                    {/* Departure */}
                    <div className="text-right">
                      <p className="text-xl font-semibold text-white">
                        {formatTime(segment.departure.at)}
                      </p>
                      <p className="text-slate-400">
                        {segment.departure.iataCode}
                      </p>
                      <p className="text-slate-500 text-sm">
                        {formatDate(segment.departure.at)}
                      </p>
                    </div>

                    {/* Path */}
                    <div className="flex-1 max-w-[200px] flex flex-col items-center gap-1">
                      <span className="text-xs text-slate-500">
                        {calculateDuration(flight.itineraries[0].segments)}
                      </span>
                      <div className="w-full flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                        <div className="flex-1 h-px bg-gradient-to-r from-blue-500 to-blue-400" />
                        <svg
                          className="w-4 h-4 text-blue-400"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M12 2L4 12h5v10h6V12h5L12 2z"
                            transform="rotate(90 12 12)"
                          />
                        </svg>
                        <div className="flex-1 h-px bg-gradient-to-r from-blue-400 to-blue-500" />
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                      </div>
                      <span className="text-xs text-slate-500">
                        {stops === 0
                          ? "Direct"
                          : `${stops} stop${stops > 1 ? "s" : ""}`}
                      </span>
                    </div>

                    {/* Arrival */}
                    <div className="text-left">
                      <p className="text-xl font-semibold text-white">
                        {formatTime(lastSegment.arrival.at)}
                      </p>
                      <p className="text-slate-400">
                        {lastSegment.arrival.iataCode}
                      </p>
                      <p className="text-slate-500 text-sm">
                        {formatDate(lastSegment.arrival.at)}
                      </p>
                    </div>
                  </div>

                  {/* Price & Action */}
                  <div className="text-right min-w-[150px]">
                    <p className="text-2xl font-semibold text-white">
                      {formatPrice(flight.price.total, flight.price.currency)}
                    </p>
                    <p className="text-slate-500 text-sm mb-3">/person</p>
                    <button
                      onClick={() => onSelectFlight(flight)}
                      className="px-6 py-2.5 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
                    >
                      Select
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {flights.length === 0 && (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-slate-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"
                />
              </svg>
            </div>
            <p className="text-slate-400">No flights found</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default FlightResults;

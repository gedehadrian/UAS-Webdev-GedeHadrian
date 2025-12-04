import { useState, useEffect, useRef } from "react";

function AirportSearch({ label, placeholder, value, onChange, name }) {
  const [query, setQuery] = useState(value || "");
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedAirport, setSelectedAirport] = useState(null);
  const wrapperRef = useRef(null);

  // Popular airports for quick selection
  const popularAirports = [
    {
      iataCode: "CGK",
      name: "Soekarno-Hatta International",
      city: "Jakarta",
      country: "Indonesia",
    },
    {
      iataCode: "DPS",
      name: "Ngurah Rai International",
      city: "Bali",
      country: "Indonesia",
    },
    {
      iataCode: "SUB",
      name: "Juanda International",
      city: "Surabaya",
      country: "Indonesia",
    },
    {
      iataCode: "JOG",
      name: "Adisucipto International",
      city: "Yogyakarta",
      country: "Indonesia",
    },
    {
      iataCode: "SIN",
      name: "Changi Airport",
      city: "Singapore",
      country: "Singapore",
    },
    {
      iataCode: "KUL",
      name: "Kuala Lumpur International",
      city: "Kuala Lumpur",
      country: "Malaysia",
    },
    {
      iataCode: "BKK",
      name: "Suvarnabhumi Airport",
      city: "Bangkok",
      country: "Thailand",
    },
    {
      iataCode: "HKG",
      name: "Hong Kong International",
      city: "Hong Kong",
      country: "Hong Kong",
    },
    {
      iataCode: "NRT",
      name: "Narita International",
      city: "Tokyo",
      country: "Japan",
    },
    {
      iataCode: "ICN",
      name: "Incheon International",
      city: "Seoul",
      country: "South Korea",
    },
    {
      iataCode: "SYD",
      name: "Sydney Airport",
      city: "Sydney",
      country: "Australia",
    },
    {
      iataCode: "MEL",
      name: "Melbourne Airport",
      city: "Melbourne",
      country: "Australia",
    },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Search airports
  useEffect(() => {
    if (query.length < 2) {
      setSuggestions(popularAirports);
      return;
    }

    const searchTerm = query.toLowerCase();
    const filtered = popularAirports.filter(
      (airport) =>
        airport.iataCode.toLowerCase().includes(searchTerm) ||
        airport.city.toLowerCase().includes(searchTerm) ||
        airport.name.toLowerCase().includes(searchTerm) ||
        airport.country.toLowerCase().includes(searchTerm)
    );
    setSuggestions(filtered.length > 0 ? filtered : popularAirports);
  }, [query]);

  const handleSelect = (airport) => {
    setSelectedAirport(airport);
    setQuery(`${airport.city} (${airport.iataCode})`);
    onChange({ target: { name, value: airport.iataCode } });
    setIsOpen(false);
  };

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    setSelectedAirport(null);
    if (e.target.value === "") {
      onChange({ target: { name, value: "" } });
    }
  };

  return (
    <div className="space-y-2" ref={wrapperRef}>
      <label className="block text-sm font-medium text-slate-300">
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg
            className="w-5 h-5 text-slate-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            />
          </svg>
        </div>
        <input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          className="w-full pl-12 pr-4 py-3.5 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200"
        />
        {selectedAirport && (
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
            <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs font-medium rounded">
              {selectedAirport.iataCode}
            </span>
          </div>
        )}

        {/* Dropdown */}
        {isOpen && (
          <div className="absolute z-50 w-full mt-2 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden">
            <div className="p-2 border-b border-slate-800">
              <span className="text-xs text-slate-500 px-2">
                {query.length < 2 ? "Popular Airports" : "Search Results"}
              </span>
            </div>
            <div className="max-h-64 overflow-y-auto">
              {loading ? (
                <div className="p-4 text-center">
                  <div className="w-5 h-5 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto" />
                </div>
              ) : suggestions.length > 0 ? (
                suggestions.map((airport) => (
                  <button
                    key={airport.iataCode}
                    type="button"
                    onClick={() => handleSelect(airport)}
                    className="w-full px-4 py-3 flex items-center gap-3 hover:bg-slate-800 transition-colors text-left"
                  >
                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-400 font-semibold text-sm">
                        {airport.iataCode}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium truncate">
                        {airport.city}
                      </p>
                      <p className="text-slate-500 text-sm truncate">
                        {airport.name}
                      </p>
                    </div>
                    <span className="text-slate-600 text-sm">
                      {airport.country}
                    </span>
                  </button>
                ))
              ) : (
                <div className="p-4 text-center text-slate-500">
                  No airports found
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AirportSearch;

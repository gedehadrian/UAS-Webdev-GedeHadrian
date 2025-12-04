import { useState } from "react";
import LandingPage from "./pages/LandingPage";
import FlightResults from "./pages/FlightResults";
import FlightBooking from "./pages/FlightBooking";
import BookingSuccess from "./pages/BookingSuccess";
import { searchFlights, bookFlight } from "./services/api";

function App() {
  const [currentPage, setCurrentPage] = useState("landing");
  const [flights, setFlights] = useState([]);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [bookingCode, setBookingCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useState(null);

  const handleSearch = async (searchData) => {
    setLoading(true);
    setSearchParams(searchData);

    try {
      const results = await searchFlights(
        searchData.origin.toUpperCase(),
        searchData.destination.toUpperCase(),
        searchData.departureDate,
        searchData.tripType === "roundtrip" ? searchData.returnDate : null,
        searchData.passengers
      );

      setFlights(results);
      setCurrentPage("results");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectFlight = (flight) => {
    setSelectedFlight(flight);
    setCurrentPage("booking");
  };

  const handleBook = async (travelerData) => {
    setLoading(true);

    try {
      const result = await bookFlight(selectedFlight, travelerData);
      setBookingCode(result.booking_code);
      setCurrentPage("success");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleNewSearch = () => {
    setCurrentPage("landing");
    setFlights([]);
    setSelectedFlight(null);
    setBookingCode("");
    setSearchParams(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      {/* Background Elements - Only show on non-landing pages */}
      {currentPage !== "landing" && (
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
          <div
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                                             linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
              backgroundSize: "50px 50px",
            }}
          />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10">
        {currentPage === "landing" && (
          <LandingPage onSearch={handleSearch} loading={loading} />
        )}

        {currentPage === "results" && (
          <FlightResults
            flights={flights}
            onSelectFlight={handleSelectFlight}
            onBack={() => setCurrentPage("landing")}
            searchParams={searchParams}
          />
        )}

        {currentPage === "booking" && selectedFlight && (
          <FlightBooking
            flight={selectedFlight}
            onBook={handleBook}
            onBack={() => setCurrentPage("results")}
            loading={loading}
          />
        )}

        {currentPage === "success" && (
          <BookingSuccess
            bookingCode={bookingCode}
            onNewSearch={handleNewSearch}
          />
        )}
      </div>
    </div>
  );
}

export default App;

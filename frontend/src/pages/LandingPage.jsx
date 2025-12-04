import { useState } from "react";
import AirportSearch from "../components/AirportSearch";

function LandingPage({ onSearch, loading }) {
  const [formData, setFormData] = useState({
    origin: "",
    destination: "",
    departureDate: "",
    returnDate: "",
    tripType: "oneway",
    passengers: 1,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(formData);
  };

  const handleSwap = () => {
    setFormData((prev) => ({
      ...prev,
      origin: prev.destination,
      destination: prev.origin,
    }));
  };

  const getDateString = (daysFromNow) => {
    const date = new Date();
    date.setDate(date.getDate() + daysFromNow);
    return date.toISOString().split("T")[0];
  };

  // Popular destinations data
  const popularDestinations = [
    {
      code: "DPS",
      city: "Bali",
      country: "Indonesia",
      image:
        "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&h=300&fit=crop",
      price: "From $120",
    },
    {
      code: "SIN",
      city: "Singapore",
      country: "Singapore",
      image:
        "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=400&h=300&fit=crop",
      price: "From $85",
    },
    {
      code: "BKK",
      city: "Bangkok",
      country: "Thailand",
      image:
        "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=400&h=300&fit=crop",
      price: "From $95",
    },
    {
      code: "NRT",
      city: "Tokyo",
      country: "Japan",
      image:
        "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=300&fit=crop",
      price: "From $250",
    },
    {
      code: "ICN",
      city: "Seoul",
      country: "South Korea",
      image:
        "https://images.unsplash.com/photo-1538485399081-7191377e8241?w=400&h=300&fit=crop",
      price: "From $220",
    },
    {
      code: "SYD",
      city: "Sydney",
      country: "Australia",
      image:
        "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=400&h=300&fit=crop",
      price: "From $350",
    },
  ];

  const features = [
    {
      icon: "fa-solid fa-shield-halved",
      title: "Secure Booking",
      desc: "Your payment is protected",
    },
    {
      icon: "fa-solid fa-tags",
      title: "Best Prices",
      desc: "Guaranteed lowest fares",
    },
    {
      icon: "fa-solid fa-bolt",
      title: "Instant Confirm",
      desc: "Real-time booking confirmation",
    },
    {
      icon: "fa-solid fa-globe",
      title: "500+ Airlines",
      desc: "Global coverage worldwide",
    },
  ];

  const quickDates = [
    { label: "Today", days: 0 },
    { label: "Tomorrow", days: 1 },
    { label: "+7 Days", days: 7 },
    { label: "+14 Days", days: 14 },
  ];

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <i className="fa-solid fa-plane text-white text-lg"></i>
              </div>
              <span className="text-xl font-bold text-white">
                Durian Flight
              </span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a
                href="#search"
                className="text-slate-300 hover:text-white transition-colors flex items-center gap-2"
              >
                <i className="fa-solid fa-magnifying-glass text-sm"></i>
                Flights
              </a>
              <a
                href="#destinations"
                className="text-slate-300 hover:text-white transition-colors flex items-center gap-2"
              >
                <i className="fa-solid fa-location-dot text-sm"></i>
                Destinations
              </a>
              <a
                href="#features"
                className="text-slate-300 hover:text-white transition-colors flex items-center gap-2"
              >
                <i className="fa-solid fa-star text-sm"></i>
                Why Us
              </a>
            </div>
            <div className="flex items-center gap-4">
              <button className="text-slate-300 hover:text-white transition-colors flex items-center gap-1">
                <i className="fa-solid fa-globe text-sm"></i>
                EN
              </button>
              <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-all flex items-center gap-2">
                <i className="fa-solid fa-user"></i>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <section id="search" className="relative pt-32 pb-40 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-1/4 w-[600px] h-[600px] bg-blue-500/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/5 rounded-full blur-[150px]" />
        </div>

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <i className="fa-solid fa-plane absolute top-40 left-10 text-4xl text-blue-500/20 animate-float-slow"></i>
          <i className="fa-solid fa-plane-departure absolute top-60 right-20 text-2xl text-blue-500/15 animate-float-medium"></i>
          <i className="fa-solid fa-plane-arrival absolute bottom-40 left-1/4 text-3xl text-blue-500/10 animate-float-fast"></i>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full mb-6">
              <i className="fa-solid fa-circle text-green-400 text-xs animate-pulse"></i>
              <span className="text-blue-400 text-sm font-medium">
                Live prices from 500+ airlines
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Find Your Next
              <span className="block bg-gradient-to-r from-blue-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                Adventure
              </span>
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Search and compare millions of flights from anywhere to
              everywhere. Book with confidence at the best prices.
            </p>
          </div>

          {/* Search Card */}
          <div className="max-w-5xl mx-auto">
            <div className="bg-slate-900/70 backdrop-blur-2xl border border-slate-800 rounded-3xl p-8 shadow-2xl shadow-black/20">
              <form onSubmit={handleSubmit}>
                {/* Trip Type */}
                <div className="flex flex-wrap items-center gap-6 mb-8">
                  <div className="flex gap-2 p-1 bg-slate-800/50 rounded-xl">
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, tripType: "oneway" }))
                      }
                      className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                        formData.tripType === "oneway"
                          ? "bg-blue-500 text-white shadow-lg shadow-blue-500/25"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      <i className="fa-solid fa-arrow-right"></i>
                      One Way
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          tripType: "roundtrip",
                        }))
                      }
                      className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                        formData.tripType === "roundtrip"
                          ? "bg-blue-500 text-white shadow-lg shadow-blue-500/25"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      <i className="fa-solid fa-arrow-right-arrow-left"></i>
                      Round Trip
                    </button>
                  </div>

                  {/* Passengers */}
                  <div className="flex items-center gap-3 md:ml-auto">
                    <span className="text-slate-400 text-sm flex items-center gap-2">
                      <i className="fa-solid fa-users"></i>
                      Passengers:
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            passengers: Math.max(1, prev.passengers - 1),
                          }))
                        }
                        className="w-8 h-8 bg-slate-800 border border-slate-700 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-600 transition-all"
                      >
                        <i className="fa-solid fa-minus text-xs"></i>
                      </button>
                      <span className="w-8 text-center text-white font-semibold">
                        {formData.passengers}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            passengers: Math.min(9, prev.passengers + 1),
                          }))
                        }
                        className="w-8 h-8 bg-slate-800 border border-slate-700 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-600 transition-all"
                      >
                        <i className="fa-solid fa-plus text-xs"></i>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Main Search Fields */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-6">
                  {/* From */}
                  <div className="lg:col-span-3">
                    <AirportSearch
                      label="From"
                      placeholder="Departure city"
                      name="origin"
                      value={formData.origin}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Swap Button */}
                  <div className="hidden lg:flex lg:col-span-1 items-end justify-center pb-2">
                    <button
                      type="button"
                      onClick={handleSwap}
                      className="w-12 h-12 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:rotate-180 group"
                    >
                      <i className="fa-solid fa-right-left text-slate-400 group-hover:text-blue-400 transition-colors"></i>
                    </button>
                  </div>

                  {/* To */}
                  <div className="lg:col-span-3">
                    <AirportSearch
                      label="To"
                      placeholder="Arrival city"
                      name="destination"
                      value={formData.destination}
                      onChange={handleChange}
                    />
                  </div>

                  {/* Departure Date */}
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      <i className="fa-solid fa-calendar-day mr-2"></i>
                      Departure
                    </label>
                    <input
                      type="date"
                      name="departureDate"
                      value={formData.departureDate}
                      onChange={handleChange}
                      required
                      min={getDateString(0)}
                      className="w-full px-4 py-3.5 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200"
                    />
                  </div>

                  {/* Return Date */}
                  <div
                    className={`lg:col-span-2 transition-all duration-300 ${
                      formData.tripType === "roundtrip"
                        ? "opacity-100"
                        : "opacity-40 pointer-events-none"
                    }`}
                  >
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      <i className="fa-solid fa-calendar-check mr-2"></i>
                      Return
                    </label>
                    <input
                      type="date"
                      name="returnDate"
                      value={formData.returnDate}
                      onChange={handleChange}
                      min={formData.departureDate || getDateString(0)}
                      className="w-full px-4 py-3.5 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-200"
                    />
                  </div>

                  {/* Search Button */}
                  <div className="lg:col-span-1 flex items-end">
                    <button
                      type="submit"
                      disabled={
                        loading ||
                        !formData.origin ||
                        !formData.destination ||
                        !formData.departureDate
                      }
                      className="w-full h-[54px] bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-slate-700 disabled:to-slate-700 text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 disabled:shadow-none"
                    >
                      {loading ? (
                        <i className="fa-solid fa-spinner fa-spin text-xl"></i>
                      ) : (
                        <i className="fa-solid fa-magnifying-glass text-xl"></i>
                      )}
                    </button>
                  </div>
                </div>

                {/* Quick Dates */}
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-slate-500 text-sm">
                    <i className="fa-solid fa-clock mr-2"></i>
                    Quick select:
                  </span>
                  {quickDates.map((item) => (
                    <button
                      key={item.days}
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          departureDate: getDateString(item.days),
                        }))
                      }
                      className={`px-4 py-2 text-sm rounded-lg transition-all ${
                        formData.departureDate === getDateString(item.days)
                          ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                          : "bg-slate-800/50 text-slate-400 border border-slate-700 hover:text-white hover:border-slate-600"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 border-t border-slate-800/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Why Choose Us
            </h2>
            <p className="text-slate-400">
              Experience the best flight booking service
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-slate-900/30 border border-slate-800/50 rounded-2xl p-6 text-center hover:border-blue-500/30 transition-all duration-300 group"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <i className={`${feature.icon} text-2xl text-blue-400`}></i>
                </div>
                <h3 className="text-white font-semibold mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-500 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section id="destinations" className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">
                <i className="fa-solid fa-fire text-orange-500 mr-3"></i>
                Popular Destinations
              </h2>
              <p className="text-slate-400">
                Explore trending destinations with amazing deals
              </p>
            </div>
            <button className="hidden md:flex text-blue-400 hover:text-blue-300 font-medium items-center gap-2 transition-colors">
              View all
              <i className="fa-solid fa-arrow-right"></i>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularDestinations.map((dest, index) => (
              <button
                key={index}
                onClick={() => {
                  setFormData((prev) => ({ ...prev, destination: dest.code }));
                  document
                    .getElementById("search")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="group relative h-64 rounded-2xl overflow-hidden text-left"
              >
                {/* Image */}
                <img
                  src={dest.image}
                  alt={dest.city}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-blue-400 text-sm font-medium mb-1 flex items-center gap-1">
                        <i className="fa-solid fa-location-dot"></i>
                        {dest.code}
                      </p>
                      <h3 className="text-2xl font-bold text-white">
                        {dest.city}
                      </h3>
                      <p className="text-slate-400">{dest.country}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-semibold">{dest.price}</p>
                      <p className="text-slate-400 text-sm">per person</p>
                    </div>
                  </div>
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-500/50 rounded-2xl transition-all duration-300" />

                {/* Hover Icon */}
                <div className="absolute top-4 right-4 w-10 h-10 bg-white/10 backdrop-blur rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <i className="fa-solid fa-arrow-right text-white"></i>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 border-t border-slate-800/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="group">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <i className="fa-solid fa-plane text-2xl text-blue-400"></i>
              </div>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                500+
              </div>
              <div className="text-slate-400">Airlines</div>
            </div>
            <div className="group">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <i className="fa-solid fa-users text-2xl text-green-400"></i>
              </div>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                2M+
              </div>
              <div className="text-slate-400">Happy Travelers</div>
            </div>
            <div className="group">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <i className="fa-solid fa-earth-americas text-2xl text-purple-400"></i>
              </div>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                150+
              </div>
              <div className="text-slate-400">Countries</div>
            </div>
            <div className="group">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-orange-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <i className="fa-solid fa-headset text-2xl text-orange-400"></i>
              </div>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                24/7
              </div>
              <div className="text-slate-400">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="relative bg-gradient-to-r from-blue-600 to-blue-700 rounded-3xl p-12 text-center overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

            <div className="relative z-10">
              <i className="fa-solid fa-paper-plane text-5xl text-white/80 mb-6"></i>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready for your next trip?
              </h2>
              <p className="text-blue-100 mb-8 max-w-xl mx-auto">
                Join millions of travelers who trust Durian Flight for their
                flight bookings. Start searching now and find your perfect
                flight.
              </p>
              <button
                onClick={() =>
                  document
                    .getElementById("search")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-all shadow-lg inline-flex items-center gap-2"
              >
                <i className="fa-solid fa-magnifying-glass"></i>
                Search Flights Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-800/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <i className="fa-solid fa-plane text-white"></i>
                </div>
                <span className="text-xl font-bold text-white">
                  Durian Flight
                </span>
              </div>
              <p className="text-slate-500 text-sm mb-4">
                Your trusted partner for flight bookings worldwide.
              </p>
              {/* Social Icons */}
              <div className="flex items-center gap-3">
                <a
                  href="#"
                  className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-blue-500 flex items-center justify-center text-slate-400 hover:text-white transition-all"
                >
                  <i className="fa-brands fa-facebook-f"></i>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-sky-500 flex items-center justify-center text-slate-400 hover:text-white transition-all"
                >
                  <i className="fa-brands fa-twitter"></i>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-pink-500 flex items-center justify-center text-slate-400 hover:text-white transition-all"
                >
                  <i className="fa-brands fa-instagram"></i>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-blue-600 flex items-center justify-center text-slate-400 hover:text-white transition-all"
                >
                  <i className="fa-brands fa-linkedin-in"></i>
                </a>
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                <i className="fa-solid fa-building text-blue-400"></i>
                Company
              </h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-slate-400 hover:text-white transition-colors text-sm flex items-center gap-2"
                  >
                    <i className="fa-solid fa-chevron-right text-xs text-slate-600"></i>
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-slate-400 hover:text-white transition-colors text-sm flex items-center gap-2"
                  >
                    <i className="fa-solid fa-chevron-right text-xs text-slate-600"></i>
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-slate-400 hover:text-white transition-colors text-sm flex items-center gap-2"
                  >
                    <i className="fa-solid fa-chevron-right text-xs text-slate-600"></i>
                    Press
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                <i className="fa-solid fa-life-ring text-green-400"></i>
                Support
              </h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-slate-400 hover:text-white transition-colors text-sm flex items-center gap-2"
                  >
                    <i className="fa-solid fa-chevron-right text-xs text-slate-600"></i>
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-slate-400 hover:text-white transition-colors text-sm flex items-center gap-2"
                  >
                    <i className="fa-solid fa-chevron-right text-xs text-slate-600"></i>
                    Contact Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-slate-400 hover:text-white transition-colors text-sm flex items-center gap-2"
                  >
                    <i className="fa-solid fa-chevron-right text-xs text-slate-600"></i>
                    FAQs
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                <i className="fa-solid fa-scale-balanced text-purple-400"></i>
                Legal
              </h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-slate-400 hover:text-white transition-colors text-sm flex items-center gap-2"
                  >
                    <i className="fa-solid fa-chevron-right text-xs text-slate-600"></i>
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-slate-400 hover:text-white transition-colors text-sm flex items-center gap-2"
                  >
                    <i className="fa-solid fa-chevron-right text-xs text-slate-600"></i>
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-slate-400 hover:text-white transition-colors text-sm flex items-center gap-2"
                  >
                    <i className="fa-solid fa-chevron-right text-xs text-slate-600"></i>
                    Cookie Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-500 text-sm flex items-center gap-2">
              <i className="fa-regular fa-copyright"></i>
              2025 Durian Flight. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <span className="text-slate-500 text-sm">Powered by</span>
              <span className="text-blue-400 font-medium flex items-center gap-2">
                <i className="fa-solid fa-code"></i>
                Amadeus API
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;

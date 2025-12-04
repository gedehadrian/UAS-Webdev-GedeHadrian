function BookingSuccess({ bookingCode, onNewSearch }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-8">
          <svg
            className="w-10 h-10 text-emerald-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h1 className="text-3xl font-semibold text-white mb-2">
          Booking Confirmed
        </h1>
        <p className="text-slate-400 mb-8">
          Your flight has been successfully booked
        </p>

        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 mb-8">
          <p className="text-slate-500 text-sm mb-2">Booking Reference</p>
          <p className="text-3xl font-mono font-bold text-blue-400 tracking-wider">
            {bookingCode}
          </p>
        </div>

        <p className="text-slate-500 text-sm mb-8 leading-relaxed">
          A confirmation email has been sent to your email address. Please save
          your booking reference for check-in.
        </p>

        <button
          onClick={onNewSearch}
          className="inline-flex items-center gap-2 px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
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
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <span>Search New Flight</span>
        </button>
      </div>
    </div>
  );
}

export default BookingSuccess;

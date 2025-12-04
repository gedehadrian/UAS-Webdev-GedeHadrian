function BookingSuccess({ bookingCode, onNewSearch }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md text-center">
        {/* Success Icon */}
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-8">
          <i className="fa-solid fa-check text-4xl text-emerald-400"></i>
        </div>

        <h1 className="text-3xl font-semibold text-white mb-2">
          Booking Confirmed!
        </h1>
        <p className="text-slate-400 mb-8">
          Your flight has been successfully booked
        </p>

        {/* Booking Code */}
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 mb-8">
          <p className="text-slate-500 text-sm mb-3 flex items-center justify-center gap-2">
            <i className="fa-solid fa-ticket"></i>
            Booking Reference
          </p>
          <p className="text-2xl md:text-3xl font-mono font-bold text-blue-400 tracking-wider break-all px-2">
            {bookingCode}
          </p>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-slate-900/30 border border-slate-800 rounded-xl p-4">
            <i className="fa-solid fa-envelope text-blue-400 text-xl mb-2"></i>
            <p className="text-slate-400 text-sm">
              Confirmation sent to your email
            </p>
          </div>
          <div className="bg-slate-900/30 border border-slate-800 rounded-xl p-4">
            <i className="fa-solid fa-mobile-screen text-blue-400 text-xl mb-2"></i>
            <p className="text-slate-400 text-sm">Save code for check-in</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={onNewSearch}
            className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
          >
            <i className="fa-solid fa-magnifying-glass"></i>
            <span>Search New Flight</span>
          </button>

          <button
            onClick={() => window.print()}
            className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-xl transition-all duration-200"
          >
            <i className="fa-solid fa-print"></i>
            <span>Print Confirmation</span>
          </button>
        </div>

        {/* Footer Note */}
        <p className="mt-8 text-slate-600 text-sm flex items-center justify-center gap-2">
          <i className="fa-solid fa-circle-info"></i>
          Need help? Contact our 24/7 support
        </p>
      </div>
    </div>
  );
}

export default BookingSuccess;

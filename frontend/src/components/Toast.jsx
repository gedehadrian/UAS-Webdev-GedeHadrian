import { useState, useEffect } from "react";

function Toast({ message, type = "error", onClose, duration = 5000 }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for fade out animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: <i className="fa-solid fa-check-circle text-emerald-400"></i>,
    error: <i className="fa-solid fa-exclamation-circle text-red-400"></i>,
    warning: (
      <i className="fa-solid fa-triangle-exclamation text-amber-400"></i>
    ),
    info: <i className="fa-solid fa-info-circle text-blue-400"></i>,
  };

  const bgColors = {
    success: "bg-emerald-500/10 border-emerald-500/30",
    error: "bg-red-500/10 border-red-500/30",
    warning: "bg-amber-500/10 border-amber-500/30",
    info: "bg-blue-500/10 border-blue-500/30",
  };

  return (
    <div
      className={`fixed top-6 right-6 z-[100] transition-all duration-300 ${
        isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full"
      }`}
    >
      <div
        className={`flex items-start gap-3 px-5 py-4 rounded-xl border backdrop-blur-xl shadow-2xl max-w-md ${bgColors[type]}`}
      >
        <span className="text-xl mt-0.5">{icons[type]}</span>
        <div className="flex-1">
          <p className="text-white font-medium">
            {type === "error"
              ? "Error"
              : type === "success"
              ? "Success"
              : type === "warning"
              ? "Warning"
              : "Info"}
          </p>
          <p className="text-slate-300 text-sm mt-1">{message}</p>
        </div>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
          className="text-slate-400 hover:text-white transition-colors"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>
      </div>
    </div>
  );
}

export default Toast;

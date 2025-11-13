interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
}

// Temporary notification displayed at the top of the screen
export default function Toast({ message, type = "info" }: ToastProps) {
  // Define background colors and icons for each notification type
  const bgColors = {
    success: "bg-green-600",
    error: "bg-red-600",
    info: "bg-blue-600",
  };

  // Icons for different notification types
  const icons = {
    success: (
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
          d="M5 13l4 4L19 7"
        />
      </svg>
    ),
    error: (
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
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    ),
    info: (
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
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  };

  return (
    <div
      className={`fixed left-1/2 top-6 -translate-x-1/2 ${bgColors[type]} text-white px-6 py-3 rounded-lg shadow-xl z-50 flex items-center gap-3 animate-slide-down`}
    >
      {icons[type]}
      <span className="font-medium">{message}</span>
    </div>
  );
}

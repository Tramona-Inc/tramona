import { XIcon } from "lucide-react";
import { useEffect, useState } from "react";

export function WelcomeBanner() {
  const [hasSeenBanner, setHasSeenBanner] = useState(true);

  useEffect(() => {
    setHasSeenBanner(!!localStorage.getItem("hasSeenBanner"));
  }, []);

  if (hasSeenBanner) return null;

  return (
    <div className="flex items-center gap-2 bg-teal-900 px-4 py-2 text-center text-xs font-medium text-teal-50 sm:text-sm">
      <p className="flex-1">
        Welcome to Tramona! Enjoy 25% off the same properties you see on Airbnb,
        Booking.com, and Vrbo!
      </p>
      <button
        onClick={() => {
          setHasSeenBanner(true);
          localStorage.setItem("hasSeenBanner", "true");
        }}
        className="rounded-full p-1 hover:bg-white/10"
      >
        <XIcon className="size-4" />
      </button>
    </div>
  );
}

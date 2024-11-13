import { useState } from "react";
import { BookItNowSection } from "./book-it-now/BookItNowSection";
import { NameYourPriceSection } from "./name-your-price/NameYourPriceSection";
import landingBg from "public/assets/images/landing-bg.jpg";

export default function MastHead() {
  const [activeTab, setActiveTab] = useState("search");

  return (
    <div className="bg-background-offWhite">
      {/* Hero Section */}
      <div className="relative">
        <div
          className="relative h-[300px] w-full overflow-hidden bg-cover bg-[center_85%]"
          style={{ backgroundImage: `url(${landingBg.src})` }}
        >
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative left-8 top-1/2 max-w-lg -translate-y-1/2">
            <h1 className="text-3xl font-bold text-white sm:text-4xl md:text-5xl">
              The new way to book rentals
            </h1>
            <p className="mt-2 text-lg text-white md:text-xl">
              Name your own price
            </p>
          </div>
        </div>
      </div>

      <div className="pt-8">
        {/* Booking Toggle */}
        <div className="mx-auto mb-8 max-w-md md:max-w-lg lg:max-w-3xl">
          <div className="flex rounded-full border-2 border-primaryGreen bg-white p-1">
            <button
              onClick={() => setActiveTab("search")}
              className={`flex-1 rounded-full py-3 text-center transition-all duration-200 lg:px-6 ${
                activeTab === "search"
                  ? "bg-primaryGreen text-white shadow-lg"
                  : "bg-white text-primaryGreen hover:bg-zinc-100"
              }`}
            >
              Book it now
            </button>
            <button
              onClick={() => setActiveTab("name-price")}
              className={`flex-1 rounded-full px-6 py-3 text-center transition-all duration-200 ${
                activeTab === "name-price"
                  ? "bg-primaryGreen text-white shadow-lg"
                  : "bg-white text-primaryGreen hover:bg-zinc-100"
              }`}
            >
              Name your own price
            </button>
          </div>
        </div>

        {activeTab === "search" ? (
          <BookItNowSection />
        ) : (
          <NameYourPriceSection />
        )}
      </div>
    </div>
  );
}

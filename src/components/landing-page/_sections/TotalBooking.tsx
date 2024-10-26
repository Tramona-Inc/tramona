import React, { useState, useEffect } from "react";

const DigitFlip = ({ digit }: { digit: number }) => {
  const [prevDigit, setPrevDigit] = useState(digit);
  const [flip, setFlip] = useState(false);

  useEffect(() => {
    if (digit !== prevDigit) {
      setFlip(true);
      const timer = setTimeout(() => {
        setPrevDigit(digit);
        setFlip(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [digit, prevDigit]);

  return (
    <div className="relative h-24 w-16 overflow-hidden rounded-lg bg-gradient-to-b from-teal-600 to-teal-800 shadow-lg">
      <div className="absolute inset-0 bg-black bg-opacity-20"></div>
      <div
        className={`absolute flex h-full w-full items-center justify-center text-4xl font-bold text-white transition-transform duration-500 ${flip ? "animate-digit-flip" : ""}`}
      >
        {digit}
      </div>
    </div>
  );
};

export default function EnhancedBookingCounter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const getRandomInterval = () => {
      const intervals = [45000, 60000, 90000]; // 45s, 1m, 1m30s in milliseconds
      return intervals[Math.floor(Math.random() * intervals.length)];
    };

    const incrementCount = () => {
      setCount((prevCount) => prevCount + 1);
      setTimeout(incrementCount, getRandomInterval());
    };

    setTimeout(incrementCount, getRandomInterval());

    return () => {
      // Cleanup function if needed
    };
  }, []);

  const padCount = count.toString().padStart(6, "0");

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative transform overflow-hidden rounded-3xl bg-white p-8 shadow-2xl transition-transform duration-300 hover:scale-105">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-blue-500 opacity-10"></div>
        <h2 className="relative z-10 mb-4 text-2xl font-bold text-gray-800">
          Total Bookings This Month
        </h2>
        <div className="relative z-10 flex space-x-3">
          {padCount.split("").map((digit, index) => (
            <DigitFlip key={index} digit={parseInt(digit)} />
          ))}
        </div>
        <div className="absolute right-4 top-4 flex items-center rounded-full bg-white bg-opacity-80 px-3 py-1 shadow-md">
          <div className="mr-2 h-3 w-3 animate-pulse rounded-full bg-green-400"></div>
          <span className="text-sm font-semibold text-green-600">Live</span>
        </div>
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">Bookings updated in real-time</p>
        </div>
      </div>
    </div>
  );
}

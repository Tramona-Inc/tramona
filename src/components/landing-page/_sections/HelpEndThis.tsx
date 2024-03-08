import React from "react";
import Link from "next/link"

const HelpEndThis = () => {
  return (
    <section className="bg-gray-100 p-2 md:px-2">
      <div className="flex flex-col items-center justify-center rounded-3xl bg-white p-6 text-center shadow-lg md:py-16">
        <h1 className="mb-4 text-6xl font-bold">3,200,000</h1>
        <p className="mb-4 text-xl">
          The number of empty units on Airbnb per night
        </p>
        <Link href="/auth/signup">
        <button className="rounded-full bg-black px-6 py-2 font-semibold text-white">
          Help us end this
        </button>
        </Link>
      </div>
    </section>
  );
};

export default HelpEndThis;

import React from "react";
import Link from "next/link";

const HelpEndThis = () => {
  return (
    <section className="bg-white px-2 pb-4 pt-2">
      <div className="flex flex-col items-center justify-center rounded-3xl bg-neutral-900 p-6 text-center shadow md:py-16">
        <h1 className="mb-4 text-4xl font-bold text-white md:text-6xl">
          3,200,000
        </h1>
        <p className="mb-4 text-base text-white md:text-xl">
          The number of empty units on Airbnb per night
        </p>
        <Link href="/auth/signup">
          <button className="rounded-full bg-white px-6 py-2 font-semibold">
            Help us end this
          </button>
        </Link>
      </div>
    </section>
  );
};

export default HelpEndThis;

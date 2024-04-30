import React from "react";
import Link from "next/link";
import Image from "next/image";

const HelpEndThis = () => {
  return (
    <section className="relative bg-white px-2 pb-4 pt-2">
      <div className="absolute inset-0 z-0">
        <Image
          src="/assets/images/landing-page/airbnb.png"
          alt=""
          fill
          quality={100}
          className="object-cover object-center"
        />
      </div>

      <div className="relative flex flex-col items-center justify-center rounded-3xl p-6 text-center md:py-16 z-10">
        <h1 className="mb-4 text-4xl font-bold text-white md:text-6xl">
          3,200,000
        </h1>
        <p className="mb-4 text-base text-white md:text-xl">
          The number of empty units on Airbnb per night
        </p>
        <Link href="/auth/signup">
          <button className="rounded-lg border border-white px-6 py-2 text-white font-semibold hover:bg-[#e5e5e5]">
            Book now
          </button>
        </Link>
      </div>
    </section>
  );
};

export default HelpEndThis;


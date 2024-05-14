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

      <div className="relative z-10 flex flex-col items-center justify-center rounded-3xl p-6 text-center md:py-16">
        <h2 className="mb-4 text-4xl font-bold text-white md:text-6xl">
          3,200,000
        </h2>
        <p className="mb-4 text-base text-white md:text-xl">
          The number of empty units on Airbnb per night
        </p>
        <Link
          href="/auth/signup"
          className="rounded-lg border border-white px-6 py-2 font-semibold text-white hover:bg-white hover:text-foreground"
        >
          Book now
        </Link>
      </div>
    </section>
  );
};

export default HelpEndThis;

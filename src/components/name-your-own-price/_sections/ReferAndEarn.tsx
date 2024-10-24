import React from "react";
import Image from "next/image";
import Link from "next/link";

const ReferAndEarn = () => {
  return (
    <section className="bg-white md:mx-12 md:px-2">
      <div className="flex flex-col rounded-3xl lg:flex-row">
        <div className="mb-4 w-full lg:mb-0 lg:mr-8 lg:w-1/2">
          <div className="h-48 w-full overflow-hidden md:rounded-lg lg:h-auto lg:rounded-none">
            <Image
              src="/assets/images/landing-page/referandearn.png"
              width={384}
              height={300}
              unoptimized
              alt=""
              className="h-full w-full object-cover object-center md:rounded-lg"
            />
          </div>
        </div>
        <div className="flex-1">
          <div className="flex h-full flex-col justify-center p-6">
            <h2 className="mb-4 text-3xl font-bold text-black md:text-3xl lg:mt-0 lg:text-5xl">
              Refer and earn
            </h2>
            <p className="mb-6 break-normal text-lg text-black md:text-lg lg:mb-4 lg:text-xl">
              Know someone who is traveling? Refer them to Tramona, then when
              they book, you get $30 dollars.
            </p>
            <Link href="/program">
              <button className="rounded-lg border-2 border-black bg-white px-6 py-3 text-black hover:bg-[#e5e5e5]">
                Learn more
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReferAndEarn;

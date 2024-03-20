import React from "react";
import Image from "next/image";
import Link from "next/link";

const ReferAndEarn = () => {
  return (
    <section className="bg-white p-2 md:px-2">
      <div className="flex flex-col lg:flex-row rounded-3xl border border-black bg-neutral-900 p-6 shadow">
        <div className="w-full lg:w-1/2 mb-4 lg:mb-0 lg:mr-8">
          <div className="h-48 lg:h-auto w-full overflow-hidden rounded-lg lg:rounded-none">
            <Image
              src="/assets/images/landing-page/referandearn.jpeg"
              width={384}
              height={300}
              alt=""
              className="h-full w-full rounded-lg object-cover object-center"
            />
          </div>
        </div>
        <div className="flex-1">
          <div className="flex flex-col justify-center h-full">
            <h2 className="mb-4 text-3xl font-bold text-white lg:mt-0 lg:text-5xl md:text-3xl">
              Refer and earn
            </h2>
            <p className="mb-6 lg:mb-4 break-normal text-lg text-white md:text-lg lg:text-xl">
              At Tramona, we think we're only as good as our people. Because of
              that, we've created one of the most generous partnership programs.
            </p>
            <Link href="/program">
              <button className="rounded-full bg-white px-6 py-3 text-black hover:bg-[#e5e5e5]">
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



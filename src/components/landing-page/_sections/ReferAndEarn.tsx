import React from "react";
import Image from "next/image";
import Link from "next/link";

const ReferAndEarn = () => {
  return (
    <section className="bg-gray-100 p-2 md:px-2">
      <div className="flex flex-col rounded-3xl border border-black bg-neutral-900 p-6 shadow md:flex-row md:justify-between md:px-14 md:py-16">
        <div className="mb-4 flex w-full md:mb-0 md:mr-24 md:w-96 md:justify-start">
          <div className="h-48 w-full overflow-hidden rounded-lg md:h-64 md:w-96">
            <Image
              src="/assets/images/landing-page/referandearn.jpeg"
              width={384}
              height={300}
              alt=""
              className="h-[300px] w-[384px] rounded-lg object-cover object-center"
            />
          </div>
        </div>
        <div className="flex-1 text-left md:text-left">
          <h2 className="mb-4 mt-4 text-3xl font-bold text-white md:mt-0">
            Refer and earn
          </h2>
          <p className="md:48 mb-4 break-normal text-lg text-white lg:mr-64">
            At Tramona, we think we are only as good as our people. Because of
            that, we've created one of the most generous partnership programs.
          </p>
          <Link href="/program">
            <button className="rounded-full bg-white px-4 py-2 text-black">
              Learn more
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ReferAndEarn;

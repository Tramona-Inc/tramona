import React from "react";
import Image from "next/image";
import Link from "next/link";

const ReferAndEarn = () => {
  return (
    <section className="bg-white p-2 md:px-2">
      <div className="flex flex-col rounded-3xl border border-black bg-neutral-900 p-6 shadow lg:flex-row">
        <div className="mb-4 w-full lg:mb-0 lg:mr-8 lg:w-1/2">
          <div className="h-48 w-full overflow-hidden rounded-lg lg:h-auto lg:rounded-none">
            <Image
              src="/assets/images/landing-page/referandearn.jpeg"
              width={384}
              height={300}
              unoptimized
              alt=""
              className="h-full w-full rounded-lg object-cover object-center"
            />
          </div>
        </div>
        <div className="flex-1">
          <div className="flex h-full flex-col justify-center">
            <h2 className="mb-4 text-3xl font-bold text-white md:text-3xl lg:mt-0 lg:text-5xl">
              Refer and earn
            </h2>
            <p className="mb-6 break-normal text-lg text-white md:text-lg lg:mb-4 lg:text-xl">
              We know we are only as good as our people. Because of that,
              we&apos;ve created one of the most generous partnership programs.
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

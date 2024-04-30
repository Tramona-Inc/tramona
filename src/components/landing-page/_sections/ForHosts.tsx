import React from "react";
import Image from "next/image";
import Link from "next/link";

const ForHosts = () => {
  return (
    <section className="bg-white md:px-2">
      <div className="flex flex-col-reverse md:flex-row">
        <div className="flex flex-1 flex-col justify-center md:mr-8 p-6">
          <div className="mt-4">
            <h2 className="mb-4 ml-2 text-3xl font-bold text-black md:text-left md:text-4xl lg:text-5xl">
              For hosts
            </h2>
            <p className="mb-6 ml-2 text-lg text-black md:text-left md:text-lg lg:text-xl">
              We turn your vacant calendar dates into bookings!
            </p>
            <div className="ml-2 flex md:justify-start">
              <Link href="/for-hosts">
                <button className="rounded-lg bg-white border-2 border-black px-6 py-3 hover:bg-[#e5e5e5]">
                  Learn more
                </button>
              </Link>
            </div>
          </div>
        </div>
        <div className="w-full md:w-1/2">
          <div className="h-64 w-full overflow-hidden md:rounded-lg md:h-auto">
            <Image
              src="/assets/images/landing-page/forhosts.jpeg"
              alt=""
              width={384}
              height={300}
              unoptimized
              className="h-full w-full md:rounded-lg object-cover object-center"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForHosts;

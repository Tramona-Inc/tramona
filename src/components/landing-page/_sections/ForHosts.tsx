import React from "react";
import Image from "next/image";
import Link from "next/link";

const ForHosts = () => {
  return (
    <section className="bg-gray-100 p-2 md:px-2">
      <div className="flex flex-col-reverse justify-between rounded-3xl bg-white p-6 shadow md:flex-row md:p-14">
        <div className="mt-4 md:mt-0">
          <h2 className="mb-4 mt-4 text-3xl font-bold md:mt-0">For hosts</h2>
          <p className="mb-4 text-lg">
            We turn your vacant calendar dates into bookings!
          </p>
          <Link href="/for-hosts">
            <button className="rounded-full bg-black px-4 py-2 text-white">
              Learn more
            </button>
          </Link>
        </div>
        <div className="h-48 w-full overflow-hidden rounded-lg md:h-64 md:w-96">
          <Image
            src="/assets/images/landing-page/forhosts.jpeg"
            alt=""
            width={384}
            height={300}
            className="h-[300px] w-[384px] rounded-lg object-cover object-center"
          />
        </div>
      </div>
    </section>
  );
};

export default ForHosts;

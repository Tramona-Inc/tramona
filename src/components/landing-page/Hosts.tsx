import React from "react";
import Image from "next/legacy/image";

export default function Hosts() {
  return (
    <section className="flex h-full bg-[#3843D0] py-20">
      <div className="container flex flex-col-reverse items-center justify-between gap-10 lg:flex-row">
        <div className="flex flex-col items-center space-y-5 text-center text-white lg:items-start lg:text-start">
          <div className="text-5xl font-bold uppercase xl:text-7xl">
            Hey Hosts!
          </div>
          <div className="text-2xl font-bold xl:text-3xl">
            We turn your{" "}
            <span className="max-w-md rounded bg-[#FF5EC4] px-2">
              vacant calendar dates
            </span>{" "}
            into bookings!
          </div>

          <div className="px-2 text-2xl">👋 Join today!</div>
        </div>
        <div className="relative aspect-square h-[350px] w-auto md:h-[500px]">
          <Image
            src="https://www.iwantthatdoor.com/wp-content/uploads/2021/06/modern-living-interior-design-1920x1139.jpg"
            alt="interior"
            className="rounded-lg object-cover shadow-lg"
            layout="fill"
            objectFit="cover"
          />
        </div>
      </div>
    </section>
  );
}

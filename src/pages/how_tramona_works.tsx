import React from "react";
import Image from "next/image";

export default function how_tramona() {
  return (
    <>
      <div className="container flex flex-col items-center space-y-5 py-10">
        <h1 className="text-4xl font-bold">How Tramona works</h1>

        <div className="h-full w-full rounded-xl border-2 ">
          <div className="h-[55vh] w-full overflow-hidden">
            <Image
              src="/assets/images/mansion.png"
              alt="mansion"
              width={4000}
              height={4000}
              className="object-fill"
            />
          </div>

          <div className="flex h-fit flex-row text-left ">
            <div className="flex w-1/3 flex-col space-y-5 rounded-bl-lg bg-[#1979E6] p-8 text-white">
              <h2 className="text-xl font-bold">We make the market effiient</h2>
              <p>
                More negotiation means more deals. Deals that previously would
                not have happened. We give you the freedom to choose if you want
                them.
              </p>
            </div>

            <div className="flex w-1/3 flex-col space-y-5 p-8">
              <h2 className="text-xl font-bold">We are creating new deals</h2>
              <p>
                By being on Tramona you have the freedom to do accept deals that
                work for you.
              </p>
            </div>

            <div className="flex w-1/3 flex-col space-y-5 p-8">
              <h2 className="text-xl font-bold">
                We increase your month-over-month revenue
              </h2>
              <p>
                Customers are often swayed to book a trip when presented with a
                good deal. Deals increase the likelihood of bookings - which
                means more money for you!
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

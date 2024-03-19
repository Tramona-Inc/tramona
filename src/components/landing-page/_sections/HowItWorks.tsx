import React from "react";
import Image from "next/image";
import Link from "next/link";

interface StepProps {
  number: number;
  title: string;
  description: string;
  isLast?: boolean;
}

const Step: React.FC<StepProps> = ({ number, title, description, isLast }) => (
  <div className="flex items-start">
    <div className="mr-4 flex flex-col items-center">
      <div
        className={`flex h-8 w-8 items-center justify-center rounded-full border-2 border-white text-xl font-bold text-black md:h-10 md:w-10 ${isLast ? "bg-white ring-2 ring-inset ring-black" : "bg-white ring-black"} text-sm`}
      >
        {number}
      </div>
      {!isLast && (
        <div className="m-1 h-auto min-h-[4.5rem] w-0.5 flex-auto bg-white md:min-h-12" />
      )}
    </div>
    <div className="flex-auto pb-4 md:pb-6">
      <h3 className="text-lg font-semibold text-white md:text-xl">{title}</h3>
      <p className="text-sm text-gray-200">{description}</p>
    </div>
  </div>
);

const HowItWorks: React.FC = () => (
  <section className="relative bg-gray-100 p-2 md:px-2">
    <div className="flex flex-col md:flex-row">
      <div className="relative mb-4 flex w-full flex-col justify-between rounded-3xl bg-zinc-900 p-6 text-left shadow md:mb-0 md:w-4/12">
        <div className="absolute inset-0 z-0">
          <Image
            src="/assets/images/landing-page/how_it_works.jpeg"
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
            className="rounded-3xl object-cover object-center"
          />
        </div>
        <div className="relative z-10">
          <h2 className="text-left text-5xl font-bold text-white">
            {"How Tramona Works".split(" ").map((word, index, array) =>
              index === array.length - 1 ? (
                <span key={index} className="block font-extrabold">
                  {word}
                </span>
              ) : (
                <span key={index} className="block font-normal">
                  {word}
                </span>
              ),
            )}
          </h2>
          {/* <Link href="/about">
            <button className="mt-12 rounded-3xl bg-white px-4 py-2 text-black">
              Learn more
            </button>
          </Link> */}
        </div>
      </div>
      <div className="flex w-full rounded-3xl bg-neutral-900 p-10 shadow md:ml-4 md:w-8/12">
        <div className="flex h-full flex-col justify-between">
          <Step
            number={1}
            title="Specify travel plans"
            description="You tell us where you want to travel, the dates, and how much you want to spend."
          />
          <Step
            number={2}
            title="Receive offers"
            description="We send you offer to the best performing hosts across all the big platforms."
          />
          <Step
            number={3}
            title="Host response"
            description="They will either accept, counter, or deny."
          />
          <Step
            number={4}
            title="Seal the deal"
            description="Once accepted, the unique deal is created, a price that can't be found anywhere else."
          />
          <Step
            number={5}
            title="Book and enjoy!"
            description="Get ready to embark on a memorable journey, tailored just for you."
            isLast={true}
          />
        </div>
      </div>
    </div>
  </section>
);

export default HowItWorks;

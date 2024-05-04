import React from "react";
import Image from "next/image";
import { useRef, useState } from "react";

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
        className={`flex h-8 w-8 items-center justify-center rounded-full border-2 border-black text-xl font-bold text-black md:h-10 md:w-10 lg:text-2xl ${isLast ? "bg-black text-white" : "bg-white ring-black"} text-sm`}
      >
        {number}
      </div>
      {!isLast && (
        <div className="md:min-h-18 m-1 h-auto min-h-[5rem] w-0.5 flex-auto bg-black" />
      )}
    </div>
    <div className="flex-auto pb-4 md:pb-6">
      <h3 className="text-lg font-semibold text-black md:text-xl lg:text-2xl">
        {title}
      </h3>
      <p className="text-sm text-gray-700 lg:text-lg">{description}</p>
    </div>
  </div>
);

const HowItWorks: React.FC = () => {
  const divRef = useRef<HTMLDivElement>(null);

  return (
    <section className="relative bg-white md:px-2">
      <div className="m-12 flex items-center justify-center">
        <h1 className="md:text-5xl text-3xl font-bold">How it works</h1>
      </div>
      <div className="flex flex-col md:flex-row">
        <div className="relative flex w-full flex-col justify-between  text-left md:mb-0 md:w-5/12 mb-8 md:mb-0">
          <div className="relative z-0 h-full min-h-[200px]">
            <Image
              src="/assets/images/landing-page/how_it_works.jpeg"
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority
              className="object-cover object-center md:rounded-lg"
            />
          </div>
        </div>
        <div
          ref={divRef}
          className="relative flex w-full px-4 md:px-10 md:ml-4 md:w-7/12 "
        >
          <div className="flex h-full flex-col justify-between">
            <Step
              number={1}
              title="Specify travel plans"
              description="Tell us your destination, dates, and budget. Submit an offer on a specific property or a request for a city."
            />
            <Step
              number={2}
              title="Sending your offer/request"
              description="We send your offer to the property host or to all hosts who own a property in the requested city."
            />
            <Step
              number={3}
              title="Host response"
              description="Hosts may accept, deny, or counter your offer for their property. With city requests, you'll hear back from agreeing hosts!"
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
};

export default HowItWorks;

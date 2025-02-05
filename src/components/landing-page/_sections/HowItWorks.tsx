import howItWorksPic from "public/assets/images/landing-page/how_it_works.jpeg";
import React from "react";
import Image from "next/image";
import { useRef } from "react";

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
    <section className="relative bg-white md:mx-12 md:px-2">
      <div className="m-12 flex items-center justify-center">
        <h1 className="text-3xl font-bold md:text-5xl">How it works</h1>
      </div>
      <div className="flex flex-col md:flex-row">
        <div className="relative mb-8 flex w-full flex-col justify-between text-left md:mb-0 md:w-5/12">
          <div className="relative z-0 h-full min-h-[200px]">
            <Image
              src={howItWorksPic}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover object-center md:rounded-lg"
              placeholder="blur"
            />
          </div>
        </div>
        <div
          ref={divRef}
          className="relative flex w-full px-4 md:ml-4 md:w-7/12 md:px-10"
        >
          <div className="flex h-full flex-col justify-between">
            <Step
              number={1}
              title="Travelers make a request"
              description="They tell us their destination, dates and budget."
            />
            <Step
              number={2}
              title="That request goes out to all hosts on Tramona"
              description="If hosts have a vacancy, they will see that request in the host dashboard."
            />
            <Step
              number={3}
              title="Host response"
              description="Hosts get the chance to accept, counter offer, or reject and request in their area."
            />
            <Step
              number={4}
              title="Traveler picks a match"
              description="The traveler looks through the different matches they received and makes a decision."
            />
            <Step
              number={5}
              title="Booking"
              description="Traveler books and hosts get 1 less vacancy."
              isLast={true}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;

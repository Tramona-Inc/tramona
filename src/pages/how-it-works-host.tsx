import React from "react";
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

const HowItWorksHost: React.FC = () => {
  return (
    <section className="relative px-4 py-4 md:px-2">
      <div className="flex items-center justify-center">
        <h1 className="text-center text-3xl font-bold md:text-5xl">
          How does Tramona work?
        </h1>
      </div>
      <div className="mt-24 flex justify-center">
        <div className="flex h-full flex-col justify-between">
          <Step
            number={1}
            title="Specify travel plans"
            description="Tell us your destination, dates, and budget."
          />
          <Step
            number={2}
            title="That request goes out"
            description="Your request gets sent to every host with a vacant property your requested city."
          />
          <Step
            number={3}
            title="Host response"
            description="Hosts may accept, deny, or counter your request. If it is a match, you will get a text and it will show up in your requests tab."
          />
          <Step
            number={4}
            title="Choose a match you like"
            description="Choose between all the matches hosts have sent. Get ready to travel!"
          />
          <Step
            number={5}
            title="Book and enjoy!"
            description="Book and enjoy!"
            isLast={true}
          />
        </div>
      </div>
    </section>
  );
};

export default HowItWorksHost;

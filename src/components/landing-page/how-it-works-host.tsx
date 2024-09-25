import React from "react";

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
          How Tramona fills your vacancies
        </h1>
      </div>
      <div className="mt-16 flex justify-center">
        <div className="flex h-full flex-col justify-between">
          <Step
            number={1}
            title="Travelers Come to Tramona"
            description="They enter their budget, preferred travel dates, number of travelers, and desired destination."
          />
          <Step
            number={2}
            title="Requests Are Sent Out"
            description="Their request is automatically sent to all hosts on Tramona who match the travelers' criteria."
          />
          <Step
            number={3}
            title="Hosts Respond"
            description="As a host, you can accept, decline, or counteroffer with a better deal for any available nights."
          />
          <Step
            number={4}
            title="Travelers Book"
            description="Travelers review their matches and choose the best option to book their stay."
          />
          <Step
            number={5}
            title="One Less Vacancy"
            description="You've successfully filled a vacancy and earned income from an empty night."
            isLast={true}
          />
        </div>
      </div>
    </section>
  );
};

export default HowItWorksHost;

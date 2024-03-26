import React from "react";

interface FeatureProps {
  number: string;
  title: string;
  description: string;
}

const Feature: React.FC<FeatureProps> = ({ number, title, description }) => {
  return (
    <div className="flex flex-col items-center space-y-4 text-center md:items-start md:text-left">
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-full bg-neutral-900 text-2xl text-white`}
      >
        {number}
      </div>
      <h3 className="text-2xl font-semibold">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

interface HowItWorksProps {
  steps: FeatureProps[];
  title: string;
}

const HowItWorks: React.FC<HowItWorksProps> = ({ steps, title }) => {
  return (
    <div className="bg-white px-6 py-16 lg:px-0">
      <hr className="mx-24 mb-24 h-px border-0 bg-neutral-300"></hr>
      <div className="mx-auto max-w-6xl">
        <div className="space-y-6 text-center">
          <h2 className="text-4xl font-bold">{title}</h2>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <Feature
              key={index}
              number={step.number}
              title={step.title}
              description={step.description}
            />
          ))}
        </div>
      </div>
      <hr className="mx-24 mt-24 h-px border-0 bg-neutral-300"></hr>
    </div>
  );
};

export default HowItWorks;

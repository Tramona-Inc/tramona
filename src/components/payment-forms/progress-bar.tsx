import React from "react";

interface CircleProps {
  step: number;
  currenttab: number;
}

const Circle: React.FC<CircleProps> = ({ step, currenttab }) => {
  return (
    <div className="flex flex-col items-center">
      <div className="mt-6 h-4 w-4 items-center justify-center rounded-full bg-black" />
      {step > currenttab ? (
        <div className="-mb-9 mt-[6px] w-[0.5px]  flex-1 border border-black" />
      ) : (
        <div className="-mb-9 mt-[6px] w-[0.5px]  flex-1 border border-[#BEBEBE]" />
      )}
    </div>
  );
};

export default Circle;

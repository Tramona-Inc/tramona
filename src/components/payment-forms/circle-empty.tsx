import React from "react";

export default function CircleEmpty() {
  return (
    <div className="flex flex-col items-center">
      <div className="mt-6 h-4 w-4 items-center justify-center rounded-full border-[3px] border-black opacity-50 " />
      <div className="-mb-9 mt-[6px] w-[0.5px]  flex-1 border border-[#BEBEBE]" />
    </div>
  );
}

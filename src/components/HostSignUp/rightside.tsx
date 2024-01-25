import React from "react";
import { Progress } from "@/components/ui/progress";
import Form1 from "./forms/from1";

export default function Rightside() {
  const [progress, setProgress] = React.useState(3);
  return (
    <div className="container flex h-full w-2/3 flex-col justify-center text-black">
      <div className="mb-10 space-y-5">
        <h3>Step 1 of 3</h3>
        <Progress value={progress} className="w-1/4" />
      </div>

      <Form1 />
    </div>
  );
}

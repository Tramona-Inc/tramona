import Leftside from "@/components/HostSignUp/leftside";
import Rightside from "@/components/HostSignUp/rightside";
import React, { useState } from "react";

export default function HostSignUp() {
  const [tab, setTab] = useState<number>(0);
  const [progress, setProgress] = React.useState(3);

  const handleTabValueChange = (value: number) => {
    setTab(value);
  };

  return (
    <>
      <div className="flex h-screen w-full flex-row">
        <Leftside />
        <Rightside onValueChange={handleTabValueChange} />
      </div>
    </>
  );
}

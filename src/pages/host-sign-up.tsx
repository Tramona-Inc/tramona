import Leftside from "@/components/HostSignUp/leftside";
import Rightside from "@/components/HostSignUp/rightside";
import React, { useEffect, useState } from "react";

export default function HostSignUp() {
  const [tab, setTab] = useState<number>(1);

  const handleTabValueChange = (value: number) => {
    setTab(value);
    console.log(tab + " PARENT");
  };

  useEffect(() => {}, [tab]);

  return (
    <>
      <div className="flex h-screen w-full flex-row">
        <Leftside newtab={tab} />
        <Rightside onValueChange={handleTabValueChange} />
      </div>
    </>
  );
}

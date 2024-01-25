import Leftside from "@/components/HostSignUp/leftside";
import Rightside from "@/components/HostSignUp/rightside";
import { cn } from "@/utils/utils";
import Image from "next/image";
import React, { useState } from "react";
import { Progress } from "@/components/ui/progress";

export default function HostSignUp() {
  const [tab, setTab] = useState<number>(0);
  const [progress, setProgress] = React.useState(3);

  return (
    <>
      <div className="flex h-screen w-full flex-row">
        <Leftside />
        <Rightside />
      </div>
    </>
  );
}

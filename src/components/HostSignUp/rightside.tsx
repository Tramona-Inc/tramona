import React, { useState } from "react";
import Form1 from "./forms/from1";
import Form2 from "./forms/form2";
import Form3 from "./forms/form3";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";

interface Props {
  onValueChange: (value: number) => void;
}

const Rightside: React.FC<Props> = ({ onValueChange }) => {
  const [tab, setTab] = useState<number>(1);

  let currentForm;

  switch (tab) {
    case 1:
      currentForm = <Form1 />;
      break;
    case 2:
      currentForm = <Form2 />;
      break;
    case 3:
      currentForm = <Form3 />;
      break;
    default:
      currentForm = null;
  }

  function handleTab() {
    setTab((prevTab) => {
      const newTab = prevTab + 1;
      onValueChange(newTab);
      console.log(newTab + " CHILD");
      return newTab;
    });
  }
  function prevTab() {
    setTab((prevTab) => {
      const newTab = prevTab - 1;
      onValueChange(newTab);
      console.log(newTab + " CHILD");
      return newTab;
    });
  }

  return (
    <div className="container flex w-2/3 flex-col  p-20 text-black">
      <div className="mb-10 space-y-5">
        <h3>Step {tab} of 3</h3>
        <Progress value={Math.ceil(tab * 33.25)} className="full" />
      </div>
      <div>{currentForm}</div>

      <div className="pt-16">
        {tab === 1 || tab === 3 ? (
          <div className="hidden" />
        ) : (
          <Button className="px-16" onClick={() => prevTab()}>
            {"<"}
          </Button>
        )}

        {tab === 3 ? (
          <Button className="px-16">Finished</Button>
        ) : (
          <Button className="w-1/6 px-16" onClick={() => handleTab()}>
            Next{" "}
          </Button>
        )}
      </div>
    </div>
  );
};

export default Rightside;

import React, { useState } from "react";
import Form1, { Form1Values } from "./forms/form1";
import Form2, { Form2Values } from "./forms/form2";
import Form3 from "./forms/form3";
import { Progress } from "../ui/progress";

interface Props {
  onValueChange: (value: number) => void;
  onHandleFormData: (value: Form1Values | Form2Values) => void;
}

const Rightside: React.FC<Props> = ({ onValueChange, onHandleFormData }) => {
  const [tab, setTab] = useState<number>(1);

  let currentForm;

  switch (tab) {
    case 1:
      currentForm = (
        <Form1 nextTab={nextTab} handleFormData={onHandleFormData} />
      );
      break;
    case 2:
      currentForm = (
        <Form2
          nextTab={nextTab}
          prevTab={prevTab}
          handleFormData={onHandleFormData}
        />
      );
      break;
    case 3:
      currentForm = <Form3 />;
      break;
    default:
      currentForm = null;
  }

  function nextTab() {
    setTab((prevTab) => {
      const newTab = prevTab + 1;
      onValueChange(newTab);
      //   console.log(newTab + " CHILD");
      return newTab;
    });
  }
  function prevTab() {
    setTab((prevTab) => {
      const newTab = prevTab - 1;
      onValueChange(newTab);
      //   console.log(newTab + " CHILD");
      return newTab;
    });
  }

  return (
    <div className="flex h-screen flex-col p-10 text-black md:container md:h-full md:w-2/3 md:px-20 md:pt-40">
      <div className="mb-10 space-y-5">
        <h3 className="md:text-md text-sm xl:text-lg">Step {tab} of 3</h3>
        <Progress value={Math.ceil(tab * 33.25)} className="w-3/4 md:w-1/3 " />
      </div>
      <div>{currentForm}</div>

      {/* <div className="pt-16">
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
          <Button className="w-1/6 px-16" onClick={() => nextTab()}>
            Next{" "}
          </Button>
        )}
      </div> */}
    </div>
  );
};

export default Rightside;

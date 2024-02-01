import React, { useEffect, useState } from "react";

import { Form1Values } from "@/components/HostSignUp/forms/form1";
import { Form2Values } from "@/components/HostSignUp/forms/form2";
import Leftside from "@/components/HostSignUp/leftside";
import Rightside from "@/components/HostSignUp/rightside";

export default function HostSignUp() {
  const [tab, setTab] = useState<number>(1);
  const [formContent, setFormContent] = useState<Record<string, object> | {}>(
    {},
  );

  const handleTabValueChange = (value: number) => {
    setTab(value);
    // console.log(tab + " PARENT");
  };

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  useEffect(() => {}, [tab]);

  // Get submitted form data from every tab
  // TODO: persisting data from previously submitted tab
  const handleFormData = (value: Form1Values | Form2Values) => {
    setFormContent((prevData) => ({ ...prevData, ...value }));
  };

  return (
    <>
      <div className="flex w-full flex-col md:min-h-screen lg:flex-row">
        <Leftside newtab={tab} />
        <Rightside
          onValueChange={handleTabValueChange}
          onHandleFormData={handleFormData}
        />
      </div>
    </>
  );
}

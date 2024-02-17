import React, { useEffect, useState } from "react";
import Head from "next/head";

import { type Form1Values } from "@/components/host-sign-up/forms/form1";
import { type Form2Values } from "@/components/host-sign-up/forms/form2";
import Leftside from "@/components/host-sign-up/leftside";
import Rightside from "@/components/host-sign-up/rightside";
import { useSession } from "next-auth/react";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/router";

export default function HostSignUp() {
  const [tab, setTab] = useState<number>(1);
  const [formContent, setFormContent] = useState<
    Record<string, object> | object
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  const { data: session } = useSession();

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

  const handleEmailSend = async () => {
    try {
      setIsSubmitting(true);

      const data = { ...formContent, user: session?.user };

      await fetch("/api/email/host-onboarding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      setIsSubmitting(false);
      toast({
        title: "Email sent!",
        description:
          "We will review your application for onboarding as a Tramona Host.",
      });
      void router.push("/");
    } catch (error) {
      setIsSubmitting(false);
      toast({
        title: "Oops!",
        description: "Something went wrong! Please try again",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Head>
        <title>Host Onboarding | Tramona</title>
      </Head>
      <div className="flex w-full flex-col md:min-h-screen lg:flex-row">
        <Leftside newtab={tab} />
        <Rightside
          onValueChange={handleTabValueChange}
          onHandleFormData={handleFormData}
          onSendEmail={handleEmailSend}
          isSubmitting={isSubmitting}
        />
      </div>
    </>
  );
}

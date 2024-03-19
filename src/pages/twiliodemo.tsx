import { Button } from "@/components/ui/button";
import { api } from "@/utils/api";

export default function TwilioDemo() {
  const sendWhatsApp = api.twilio.sendWhatsApp.useMutation();
  const sendEmail = api.twilio.sendEmail.useMutation();
  const sendSMS = api.twilio.sendSMS.useMutation();

  const whatsApp = () => {
    const response = sendWhatsApp.mutateAsync({
      templateId: "HXfbce509bc1b4b5d0df41803fe50e69bf",
      to: "+12066186280",
    });

    console.log("sendWhatsApp: ", response);
  };

  const sms = () => {
    const response = sendSMS.mutateAsync({
      msg: "Hi this is Tramona!",
      to: "+12066186280",
    });

    console.log("sendSMS: ", response);
  };

  const email = () => {
    const response = sendEmail.mutateAsync({
      to: "sashagordin22@gmail.com",
      subject: "Test Twilio SendGrid",
      text: "and easy to do anywhere, even with Node.js",
      html: "<strong>and easy to do anywhere, even with Node.js</strong>",
    });

    console.log("sendEmail: ", response);
  };

  return (
    <>
      <Button onClick={sms}>sms</Button>
      <Button onClick={email}>email</Button>
      <Button onClick={whatsApp}>whatsApp</Button>
    </>
  );
}
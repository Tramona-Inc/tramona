import { Button } from "@/components/ui/button";
import { api } from "@/utils/api";

export default function TwilioDemo() {
  const sendSMS = api.twilio.sendSMS.useMutation();
  const sendEmail = api.twilio.sendEmail.useMutation();

  const sms = () => {
    const response = sendSMS.mutateAsync({
      msg: "Hi this is Tramona!",
      to: "+17815794214",
    });

    console.log("sendSMS: ", response);
  };

  const email = () => {
    const response = sendEmail.mutateAsync({
      to: "cclintris@gmail.com",
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
    </>
  );
}

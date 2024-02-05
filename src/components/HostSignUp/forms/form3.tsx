import { Button } from "@/components/ui/button";

type FormSendProps = {
  onSendEmail: () => void;
  isSubmitting: boolean;
};

export default function Form1({ onSendEmail, isSubmitting }: FormSendProps) {
  //TODO: add review step to show the form data before submitting
  return (
    <div>
      <h1 className="text-2xl font-bold md:text-4xl">
        Thank you! You&apos;re all set!
      </h1>
      <h2 className="pt-10 text-2xl font-semibold md:pt-20">
        Welcome to Tramona, if you have any questions please send us an email
        directly at info@tramona.com
      </h2>
      <p className="pt-5 text-base md:text-lg">
        Click the{" "}
        <strong className="bg-primary px-2 py-2 text-xs text-zinc-50 md:text-sm">
          Submit
        </strong>{" "}
        button below to send us your Host onboarding application details for us
        to review it. Happy hosting!
      </p>
      <div className="pt-10">
        <Button
          className="w-3/6 md:w-1/6"
          onClick={onSendEmail}
          isLoading={isSubmitting}
        >
          Submit
        </Button>
      </div>
    </div>
  );
}

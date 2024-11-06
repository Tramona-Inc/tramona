import Typewriter from "typewriter-effect";
import RequestCityForm from "./RequestCityForm";
import LinkRequestForm from "@/components/link-input/LinkRequestForm";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useRef } from "react";

export default function CityRequestFormContainer({
  isRequestsPage = false,
}: {
  isRequestsPage?: boolean;
}) {
  const formRef = useRef<{ submit: () => void }>(null);

  const handleSubmit = () => {
    console.log(formRef.current);
    if (formRef.current) {
      console.log("um");
      formRef.current.submit();
    }
  };
  return (
    <div
      className={`flex w-full flex-col gap-y-3 ${isRequestsPage ? "" : "md:7/12 w-11/12 gap-y-3 lg:w-1/2"}`}
    >
      {isRequestsPage && (
        <p className="text-sm font-semibold text-muted-foreground lg:block">
          Send a request to every host in{" "}
          <span className="font-bold text-teal-900">
            <Typewriter
              component={"span"}
              options={{
                strings: ["SEATTLE", "PARIS", "MIAMI", "ANY CITY"],
                autoStart: true,
                loop: true,
              }}
            />
          </span>
        </p>
      )}
      <RequestCityForm isRequestsPage={isRequestsPage} ref={formRef} />
      <div className="flex items-center gap-x-4 text-zinc-400">
        <Separator className="flex-1 bg-zinc-400" />
        <p>or</p>
        <Separator className="flex-1 bg-zinc-400" />
      </div>
      <p className="text-pretty text-sm">
        Have a property you like? We&apos;ll send your request directly to the
        host.
      </p>
      <LinkRequestForm />
      {!isRequestsPage && (
        <Button
          type="submit"
          onClick={handleSubmit}
          className="mt-2 w-full py-6"
        >
          Submit Request
        </Button>
      )}
    </div>
  );
}

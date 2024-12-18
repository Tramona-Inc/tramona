import Typewriter from "typewriter-effect";
import RequestCityForm from "./RequestCityForm";
import LinkRequestForm from "@/components/link-input/LinkRequestForm";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useRef } from "react";
import { cn } from "@/utils/utils";

export default function CityRequestFormContainer({
  isRequestsPage = false,
}: {
  isRequestsPage?: boolean;
}) {
  const formRef = useRef<{ submit: () => void }>(null);

  const handleSubmit = () => {
    if (formRef.current) {
      formRef.current.submit();
    }
  };
  return (
    <div
      className={cn("max-w-5/6 flex w-5/6 flex-col gap-y-3 lg:w-1/2", {
        "w-11/12 md:w-7/12 lg:w-1/2": isRequestsPage,
      })}
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

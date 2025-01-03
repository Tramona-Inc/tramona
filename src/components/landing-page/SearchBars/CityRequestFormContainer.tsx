import Typewriter from "typewriter-effect";
import RequestCityForm from "./RequestCityForm";
import LinkRequestForm from "@/components/link-input/LinkRequestForm";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";
import { cn } from "@/utils/utils";
import clsx from "clsx";

export default function CityRequestFormContainer({
  isRequestsPage = false,
}: {
  isRequestsPage?: boolean;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef<{ submit: () => void; isLoading: boolean }>(null);

  const handleSubmit = () => {
    if (formRef.current) {
      formRef.current.submit();
    }
  };

  console.log(isLoading);
  return (
    <div
      className={cn("max-w-5/6 flex w-5/6 flex-col gap-y-3 lg:w-1/2", {
        "lg:w-11/12": isRequestsPage,
      })}
    >
      {isRequestsPage && (
        <p className="pt-2 text-sm font-semibold text-muted-foreground lg:block">
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
      <RequestCityForm
        isRequestsPage={isRequestsPage}
        ref={formRef}
        onLoadingChange={setIsLoading}
      />
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
          className={clsx("mt-2 w-full py-6")}
          disabled={isLoading}
        >
          {!isLoading ? (
            <p> Submit Request </p>
          ) : (
            <div className="flex h-full items-center justify-center space-x-2">
              <span className="mr-2 text-white">Submitting Request</span>
              <div className="h-1 w-1 animate-bounce rounded-full bg-white [animation-delay:-0.3s]"></div>
              <div className="h-1 w-1 animate-bounce rounded-full bg-white [animation-delay:-0.15s]"></div>
              <div className="h-1 w-1 animate-bounce rounded-full bg-white"></div>
            </div>
          )}
        </Button>
      )}
    </div>
  );
}

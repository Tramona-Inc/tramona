import Typewriter from "typewriter-effect";
import RequestCityForm from "./RequestCityForm";
import LinkRequestForm from "@/components/link-input/LinkRequestForm";
import { Separator } from "@/components/ui/separator";
import { useSession } from "next-auth/react";

export default function CityRequestFormContainer() {
  const { data: session } = useSession();
  const isAdmin = session?.user.role === "admin";


  return (
    <div className="space-y-3">
      <p className="text-sm font-semibold text-muted-foreground lg:block">
        Send a request to every host in&nbsp;
        <br className="sm:hidden" />
        <span className="font-bold text-teal-900">
          <Typewriter
            component={"span"}
            options={{
              strings: ["LOS ANGELES", "PARIS", "MIAMI", "ANY CITY"],
              autoStart: true,
              loop: true,
            }}
          />
        </span>
      </p>
      <RequestCityForm />
      {isAdmin && (
        <>
          <div className="flex items-center gap-x-4 text-zinc-400">
            <Separator className="flex-1 bg-zinc-400" />
            <p>or</p>
            <Separator className="flex-1 bg-zinc-400" />
          </div>
          <p className="text-pretty text-sm">
            Have a property you like? We&apos;ll send your request directly to
            the host.
          </p>
          <LinkRequestForm />
        </>
      )}
    </div>
  );
}

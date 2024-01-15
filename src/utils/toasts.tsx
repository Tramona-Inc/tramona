import { toast } from "@/components/ui/use-toast";
import Link from "next/link";

export function errorToast(error = "Something went wrong") {
  return toast({
    title: `${error}, please try again`,
    description: (
      <>
        <Link href="/support" className="underline underline-offset-2">
          Contact support
        </Link>{" "}
        if the issue persists
      </>
    ),
    variant: "destructive",
  });
}

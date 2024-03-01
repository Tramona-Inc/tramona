import { Button } from "@/components/ui/button";
import { ExternalLinkIcon } from "lucide-react";

export default function Page() {
  return (
    <div className="flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center gap-4">
      <h1 className="text-center text-5xl font-bold tracking-tight">
        Check your Phone
      </h1>
      <p className="text-muted-foreground">
        Please verify your phone number
      </p>
      <Button asChild>
        <a href="https://mail.google.com" target="_blank" rel="noreferrer">
          Open Gmail <ExternalLinkIcon className="size-4" />
        </a>
      </Button>
    </div>
  );
}

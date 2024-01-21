import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button, buttonVariants } from "../ui/button";
import Link from "next/link";
import { cn, formatCurrency, formatDateRange } from "@/utils/utils";
import CopyToClipboardBtn from "../utils/CopyToClipboardBtn";

export default function HowToBookDialog(
  props: React.PropsWithChildren<{
    totalPrice: number;
    airbnbUrl: string;
    checkIn: Date;
    checkOut: Date;
  }>,
) {
  const message = `Hi, I was offerd your property on Tramona for ${formatCurrency(
    props.totalPrice,
  )} total for ${formatDateRange(
    props.checkIn,
    props.checkOut,
  )} and I'd like to book it at that price.`;

  return (
    <Dialog>
      <DialogTrigger asChild>{props.children}</DialogTrigger>
      <DialogContent className="space-y-4">
        <DialogHeader>
          <DialogTitle>How To Book:</DialogTitle>
          <DialogDescription>
            Here&apos;s how to secure your booking.
          </DialogDescription>
        </DialogHeader>
        <ol className="list-decimal space-y-1 px-4 marker:text-muted-foreground">
          <li>
            Once you click{" "}
            <span className="inline-block rounded-full bg-primary pl-3 pr-2 text-white">
              Book &rarr;
            </span>{" "}
            below, you will be taken to the listing page on Airbnb.
          </li>
          <li>
            Scroll to the bottom of the listing where it says “Contact Host”.
          </li>
          <li>Click “Contact Host” and send them this message:</li>
        </ol>
        <p className="border-l-2 border-primary bg-primary/10 p-2">
          ”{message}”
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <CopyToClipboardBtn
            message={message}
            render={({ justCopied, copyMessage }) => (
              <Button
                className="rounded-full"
                size="lg"
                variant="outline"
                onClick={copyMessage}
              >
                {justCopied ? "Copied!" : "Copy message"}
              </Button>
            )}
          />
          <Link
            className={cn(buttonVariants({ size: "lg" }), "rounded-full")}
            href={props.airbnbUrl}
            target="_blank"
          >
            Book &rarr;
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
}

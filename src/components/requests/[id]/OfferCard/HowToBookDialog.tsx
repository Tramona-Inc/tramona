import { cn, formatCurrency, formatDateRange } from "@/utils/utils";
import Link from "next/link";
import CopyToClipboardBtn from "../../../_utils/CopyToClipboardBtn";
import { Button, buttonVariants } from "../../../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../ui/dialog";

export default function HowToBookDialog(
  props: React.PropsWithChildren<{
    offerNightlyPrice: number;
    originalNightlyPrice: number;
    airbnbUrl: string;
    checkIn: Date;
    checkOut: Date;
  }>,
) {
  const message = `Hi, I was offered your property on Tramona for ${formatCurrency(
    props.offerNightlyPrice,
  )} total for ${formatDateRange(
    props.checkIn,
    props.checkOut,
  )} and I'd like to book it at that price.`;

  return (
    <Dialog>
      <DialogTrigger asChild>{props.children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>How To Book:</DialogTitle>
          <DialogDescription>
            Here&apos;s how to secure your booking.
          </DialogDescription>
          <div className="flex flex-row items-center justify-center gap-5">
            <div>
              <h1 className="font-bold">Tramona Price</h1>
              <p className="font-extrabold text-primary">
                {formatCurrency(props.offerNightlyPrice)}
                <span className="font-normal text-secondary-foreground">
                  /night
                </span>
              </p>
            </div>
            <div>
              <h1 className="font-bold">Original Price</h1>
              <p className="font-extrabold text-primary">
                {formatCurrency(props.originalNightlyPrice)}
                <span className="font-normal text-secondary-foreground">
                  /night
                </span>
              </p>
            </div>
          </div>
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

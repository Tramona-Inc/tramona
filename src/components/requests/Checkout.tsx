import { ChevronLeft, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";

export default function Checkout() {
  const router = useRouter();

  const handleBackClick = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
  ) => {
    event.preventDefault();
    router.back();
  };

  return (
    <div>
      <div className="mb-8">
        <Link href="#" onClick={handleBackClick}>
          <div className="flex items-center gap-2">
            <ChevronLeft />
            <p className="font-semibold">Confirm and pay</p>
          </div>
        </Link>
      </div>
      <div className="grid grid-cols-2">
        <div>
          <div className="rounded-lg border border-teal-900 p-3 text-sm">
            <h3 className="font-bold">Best price</h3>
            <p className="text-muted-foreground">
              This is an exclusive price only available on Tramona.
            </p>
          </div>
          <div className="my-8 space-y-2">
            <h2 className="text-lg font-semibold">Your trip details</h2>
            <div className="text-sm">
              <p>Dates</p>
              <p className="font-bold">July 1 - Aug 5</p>
            </div>
            <div className="text-sm">
              <p>Guests</p>
              <p className="font-bold">2 guests</p>
            </div>
          </div>
          <Separator className="my-4" />
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Cancellation Policy</h3>
            <p className="text-sm font-semibold leading-5 text-muted-foreground">
              This is an exclusive price only available on Tramona. This is an
              exclusive price only available on Tramona. This is an exclusive
              price only available on Tramona.
            </p>
          </div>
          <Separator className="my-4" />
          <div>insert stripe checkout form here</div>
          <Separator className="my-4" />
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Contact information</h3>
            <p className="text-sm text-muted-foreground">
              We encourage every traveler to have the travel details in case of
              emergencies.
            </p>
            <p>insert contact form here</p>
          </div>
          <Separator className="my-4" />
          <div className="mt-8">
            <div className="mb-8 space-y-4 text-muted-foreground">
              <p className="text-sm font-semibold leading-5">
                On behalf of Tramona we ask that you please follow the house
                rules and treat the house as if it were your own
              </p>
              <p className="text-xs">
                By selecting the button, I agree to the booking terms. I also
                agree to the Terms of Service, Payment Terms of Service and I
                acknowledge the Privacy Policy
              </p>
            </div>
            <Button
              variant="greenPrimary"
              className="my-2 w-full font-semibold"
            >
              Confirm and pay
            </Button>
            <p className="text-center text-xs font-semibold text-muted-foreground">
              As soon as you book you will get an email and text confirmation
              with all booking details
            </p>
          </div>
        </div>
        <div className=" pl-16">
          <div className="rounded-xl border p-2">
            <div className="flex gap-2">
              <div className="overflow-hidden rounded-xl">
                <Image
                  src="/assets/images/landing-bg.jpg"
                  width={100}
                  height={100}
                  alt=""
                />
              </div>
              <div>
                <h3 className="font-semibold">
                  Entire Cabin in Gold Bar, Washington
                </h3>
                <p className="text-sm">Apartment</p>
                <div className="flex items-center gap-1">
                  <Star />
                  <p className="text-sm">4.89 (147 reviews)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { api } from "@/utils/api";
import { Card, CardContent } from "@/components/ui/card";
import PriceDetailsBeforeTax from "@/components/_common/PriceDetailsBeforeTax";
import { formatDateRange } from "@/utils/utils";
import { PropertyPageData } from "./actionButtons/RequestToBookBtn";
import RequestToBookOrBookNowPriceCard from "./priceCards/RequestToBookOrBookNowPriceCard";
import BookNowBtn from "./actionButtons/BookNowBtn";
import { useRouter } from "next/router";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";
import { useState } from "react";

// New TramonaProtectionModal component
function TramonaProtectionModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b pb-4">
            <Shield className="h-5 w-5 text-[#004236]" />
            <h3 className="text-lg font-semibold text-[#004236]">
              Tramona Protection
            </h3>
          </div>

          <div className="space-y-4 text-sm">
            <p>
              All payments are held by Tramona until 24 hours after check-in to
              ensure your money is safe.
            </p>

            <div className="space-y-2">
              <p className="font-semibold">Why Tramona?</p>
              <ul className="space-y-2">
                <li>• Lowest fees out of all major booking platforms</li>
                <li>
                  • Best customer support on the market – 24/7 assistance and
                  rebooking or instant money back guarantee
                </li>
                <li>• Money back guarantee and urgent rebooking assistance</li>
              </ul>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function RequestToBookPageMobileBottomCard({
  property,
}: {
  property: PropertyPageData;
}) {
  const [showProtectionModal, setShowProtectionModal] = useState(false);
  const { query } = useRouter();
  const checkIn = query.checkIn
    ? new Date(query.checkIn as string)
    : new Date();
  const checkOut = query.checkOut
    ? new Date(query.checkOut as string)
    : new Date();
  const numGuests = query.numGuests ? parseInt(query.numGuests as string) : 2;

  const travelerOfferedPriceBeforeFees = parseInt(
    query.travelerOfferedPriceBeforeFees as string,
  );

  const requestToBook = {
    checkIn,
    checkOut,
    numGuests,
    travelerOfferedPriceBeforeFees,
  };
  const { data: verificationStatus } =
    api.users.myVerificationStatus.useQuery();

  return (
    <>
      <Card className="fixed bottom-12 left-0 w-full border-t lg:hidden">
        <CardContent className="flex flex-col px-1 pb-1 text-sm">
          <div className="flex flex-row items-center justify-between">
            <div className="flex basis-1/2 flex-col">
              <PriceDetailsBeforeTax
                property={property}
                requestToBook={requestToBook}
              />
              <p className="font-semibold">
                {formatDateRange(requestToBook.checkIn, requestToBook.checkOut)}
              </p>
              <Button
                variant="link"
                size="sm"
                className="flex items-center justify-start gap-1 p-0 text-xs text-[#004236]"
                onClick={() => setShowProtectionModal(true)}
              >
                <Shield className="h-4 w-4" />
                Tramona Protection
              </Button>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex flex-row gap-x-2">
                <Dialog>
                  <DialogTrigger>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs tracking-tight sm:text-sm"
                    >
                      Request To Book
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <RequestToBookOrBookNowPriceCard property={property} />
                  </DialogContent>
                </Dialog>
                {property.bookItNowEnabled && (
                  <BookNowBtn
                    btnSize="sm"
                    property={property}
                    requestToBook={requestToBook}
                  />
                )}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                You won&apos;t be charged yet
              </p>
            </div>
          </div>
          {verificationStatus?.isIdentityVerified === "false" &&
            property.stripeVerRequired === true && (
              <p className="text-center text-xs font-semibold text-red-500">
                Host requires Stripe verification prior to booking
              </p>
            )}
        </CardContent>
      </Card>

      <TramonaProtectionModal
        isOpen={showProtectionModal}
        onClose={() => setShowProtectionModal(false)}
      />
    </>
  );
}

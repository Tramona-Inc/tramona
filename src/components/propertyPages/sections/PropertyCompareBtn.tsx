import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../../ui/button";
import { type OriginalListing } from "@/utils/listing-sites";
import Link from "next/link";
import { ExternalLinkIcon } from "lucide-react";

export function PropertyCompareBtn({
  checkIn,
  checkOut,
  numGuests,
  originalListing,
}: {
  checkIn: Date;
  checkOut: Date;
  numGuests: number;
  originalListing: OriginalListing;
}) {
  const listingUrl = originalListing.getListingUrl({
    checkIn,
    checkOut,
    numGuests,
  });

  const checkoutUrl = originalListing.getCheckoutUrl({
    checkIn,
    checkOut,
    numGuests,
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary">
          Compare to {originalListing.site.siteName}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Compare offer</DialogTitle>
        </DialogHeader>
        <p>
          Remember: When comparing prices, {originalListing.site.siteName} hides
          the final price until the last step. Our price is always the final,
          all-in price.
        </p>
        <DialogFooter>
          <Button asChild variant="secondary">
            <Link target="_blank" rel="noopener noreferrer" href={listingUrl}>
              See property on {originalListing.site.siteName}
              <ExternalLinkIcon className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild>
            <Link target="_blank" rel="noopener noreferrer" href={checkoutUrl}>
              See pricing on {originalListing.site.siteName}
              <ExternalLinkIcon className="h-4 w-4" />
            </Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

import { Separator } from "../ui/separator";
import { formatCurrency, getNumNights } from "@/utils/utils";
import { plural } from "@/utils/utils";
import { TAX_PERCENTAGE } from "@/utils/constants";
import { type Offer } from "@/server/db/schema";

export function OfferPriceDetails({
  offer,
}: {
  offer: Pick<Offer, "totalPrice" | "tramonaFee" | "checkIn" | "checkOut">;
}) {
  const numberOfNights = getNumNights(offer.checkIn, offer.checkOut);
  const nightlyPrice = offer.totalPrice / numberOfNights;
  const tax = (offer.totalPrice + offer.tramonaFee) * TAX_PERCENTAGE;
  const total = offer.totalPrice + offer.tramonaFee + tax;

  const items = [
    {
      title: `${formatCurrency(nightlyPrice)} x ${plural(numberOfNights, "night")}`,
      price: `${formatCurrency(offer.totalPrice)}`,
    },
    {
      title: "Cleaning fee",
      price: "Included",
    },
    {
      title: "Tramona service fee",
      price: `${formatCurrency(offer.tramonaFee)}`,
    },
    {
      title: "Taxes",
      price: `${formatCurrency(tax)}`,
    },
  ];

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div
          className="flex items-center justify-between text-sm font-semibold"
          key={index}
        >
          <p className="underline">{item.title}</p>
          <p>{item.price}</p>
        </div>
      ))}
      <Separator />
      <div className="flex items-center justify-between pb-4 font-bold">
        <p>Total (USD)</p>
        <p>{formatCurrency(total)}</p>
      </div>
    </div>
  );
}

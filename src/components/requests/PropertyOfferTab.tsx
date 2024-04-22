import { api } from "@/utils/api";
import PropertyOfferCard from "./PropertOfferCard";

export default function PropertyOfferTab() {
  const { data: offers } = api.biddings.getMyBids.useQuery();

  return (
    <div>
      {offers?.map((offer) => {
        return (
          <PropertyOfferCard
            key={offer.id}
            offer={{
              propertyId: offer.property?.id ?? 0,
              location: "",
              offerNightlyPrice: offer.amount ?? 0,
              checkIn: offer.checkIn,
              checkOut: offer.checkOut,
              guests: offer.numGuests,
              status: offer.resolvedAt ? true : false,
              propertyName: offer.property?.name,
              propertyImage: offer.property?.imageUrls[0] ?? "",
            }}
          />
        );
      })}
    </div>
  );
}

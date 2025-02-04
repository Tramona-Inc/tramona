import PropertyPage from "./PropertyPage";
import { RouterOutputs } from "@/utils/api";
import RequestToBookPageSidebar from "./sidebars/RequestToBookSideBar";
import RequestToBookPageMobileBottomCard from "./sidebars/RequestToBookPageMobileBottomCard";

export type OfferWithDetails = RouterOutputs["offers"]["getByIdWithDetails"];
export type PropertyPageData = RouterOutputs["properties"]["getById"];
export type RequestToBookDetails = {
  checkIn: Date;
  checkOut: Date;
  numGuests: number;
  calculatedTravelerPrice: number;
};

export default function RequestToBookPage({
  property,
}: {
  property: PropertyPageData;
}) {
  return (
    <>
      <PropertyPage
        property={property}
        sidebar={<RequestToBookPageSidebar property={property} />}
        mobileBottomCard={
          <RequestToBookPageMobileBottomCard property={property} />
        }
      />
    </>
  );
}

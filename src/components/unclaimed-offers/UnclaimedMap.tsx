import UnclaimedOfferCards from "@/components/unclaimed-offers/UnclaimedOfferCards";
import { LoadingProvider } from "@/components/unclaimed-offers/UnclaimedMapLoadingContext";

export type MapBoundary = {
  north: number;
  south: number;
  east: number;
  west: number;
};

export default function UnclaimedMap() {
  return (
    <LoadingProvider>
      <div className="w-full px-4 sm:px-16">
        <UnclaimedOfferCards />
      </div>
    </LoadingProvider>
  );
}

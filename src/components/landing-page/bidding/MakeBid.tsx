import Spinner from '@/components/_common/Spinner';
import { api } from "@/utils/api";
import { useBidding } from "@/utils/store/bidding";
import BiddingConfirmation from "./BiddingConfirmation";
import BiddingStep1 from "./BiddingStep1";
import BiddingStep2 from "./BiddingStep2";

function MakeBid({ propertyId }: { propertyId: number }) {
  const { data: property, isLoading } = api.properties.getById.useQuery({
    id: propertyId,
  });

  const step = useBidding((state) => state.step);

  return (
    <>
      {
        isLoading ? <Spinner /> : 
        property && (
          <div>
            {step == 0 && <BiddingStep1 property={property} />}
            {step == 1 && <BiddingStep2 property={property} />}
            {step == 2 && <BiddingConfirmation property={property} />}
          </div>
        )
      }
    </>
  );
}

export default MakeBid;

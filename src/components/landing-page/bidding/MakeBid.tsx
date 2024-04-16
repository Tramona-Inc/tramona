import BiddingStep1 from "./BiddingStep1";
import BiddingStep2 from "./BiddingStep2";
import BiddingConfirmation from "./BiddingConfirmation";
import { useBidding } from "@/utils/store/listingBidding";
import { Property } from "@/server/db/schema";
function MakeBid({property}: {property: Property}) {
  const step = useBidding((state) => state.step);
  
  return (
    <div>
      {step == 0 && (
        <BiddingStep1
          property = {property}
        />
      )}
      {step == 1 && (
        <BiddingStep2
         property={property}
        />
      )}
      {step == 2 && <BiddingConfirmation 
             property={property}
      />}
    </div>
  );
}

export default MakeBid;

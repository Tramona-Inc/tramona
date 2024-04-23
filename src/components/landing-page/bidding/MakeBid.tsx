import { type Property } from "@/server/db/schema";
import { useBidding } from "@/utils/store/bidding";
import BiddingConfirmation from "./BiddingConfirmation";
import BiddingStep1 from "./BiddingStep1";
import BiddingStep2 from "./BiddingStep2";

function MakeBid({ property }: { property: Property }) {
  const step = useBidding((state) => state.step);
  //we need to make a stop if the user is not verified 
  return (
    <div>
      {step == 0 && <BiddingStep1 property={property} />}
      {step == 2 && <BiddingStep2 property={property} />}
      {step == 3 && <BiddingConfirmation property={property} />}
    </div>
  );
}

export default MakeBid;
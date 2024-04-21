import { type Property } from "@/server/db/schema";
import { useBidding } from "@/utils/store/bidding";
import BiddingConfirmation from "./BiddingConfirmation";
import BiddingStep1 from "./BiddingStep1";
import BiddingStep2 from "./BiddingStep2";
function MakeBid({ property }: { property: Property }) {
  const step = useBidding((state) => state.step);
  const date = useBidding((state) => state.date);

  return (
    <div>
      {step == 0 && <BiddingStep1 property={property} />}
      {step == 1 && <BiddingStep2 property={property} />}
      {step == 2 && <BiddingConfirmation property={property} />}
    </div>
  );
}

export default MakeBid;

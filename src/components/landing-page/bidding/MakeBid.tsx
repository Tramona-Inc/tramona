import Spinner from "@/components/_common/Spinner";
import { Button } from "@/components/ui/button";
import { api } from "@/utils/api";
import { useBidding } from "@/utils/store/bidding";
import { cn } from "@/utils/utils";
import { ChevronLeft } from "lucide-react";
import BiddingConfirmation from "./BiddingConfirmation";
import BiddingStep1 from "./BiddingStep1";
import BiddingStep2 from "./BiddingStep2";

function MakeBid({ propertyId }: { propertyId: number }) {
  const { data: property, isLoading } = api.properties.getById.useQuery({
    id: propertyId,
  });

  const step = useBidding((state) => state.step);
  const setStep = useBidding((state) => state.setStep);
  //we need to make a stop if the user is not verified

  return (
    <div>
      {step !== 0 && (
        <Button
          variant={"ghost"}
          className={cn("absolute left-1 top-0 md:left-4 md:top-4")}
          onClick={() => {
            if (step - 1 > -1) {
              setStep(step - 1);
            }
          }}
        >
          <ChevronLeft />
        </Button>
      )}
      {isLoading ? (
        <Spinner />
      ) : (
        property && (
          <div>
            {step == 0 && <BiddingStep1 property={property} />}
            {step == 1 && <BiddingStep2 property={property} />}
            {step == 2 && <BiddingConfirmation property={property} />}
          </div>
        )
      )}
    </div>
  );
}

export default MakeBid;

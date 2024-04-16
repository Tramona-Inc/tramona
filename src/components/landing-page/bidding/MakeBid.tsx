import BiddingStep1 from "./BiddingStep1";
import BiddingStep2 from "./BiddingStep2";
import BiddingConfirmation from "./BiddingConfirmation";
import { useBidding } from "@/utils/store/listingBidding";

function MakeBid() {
  const step = useBidding((state) => state.step);
  return (
    <div>
      {step == 0 && (
        <BiddingStep1
          propertyTitle="Beautiful Beach Property"
          airbnbPrice={100}
          imageUrl="https://a0.muscache.com/im/pictures/miso/Hosting-1039233709360808183/original/f6b8ac21-837e-465e-98d5-3755d14c33f1.jpeg?im_w=1200"
        />
      )}
      {step == 1 && (
        <BiddingStep2
          propertyTitle="Beautiful Beach Property"
          amount={50}
          numOfNights={3}
          airbnbPrice={100}
          imageUrl="https://a0.muscache.com/im/pictures/miso/Hosting-1039233709360808183/original/f6b8ac21-837e-465e-98d5-3755d14c33f1.jpeg?im_w=1200"
        />
      )}
      {step == 2 && <BiddingConfirmation 
               propertyTitle="Beautiful Beach Property"
               amount={50}
               numOfNights={3}
               airbnbPrice={100}
               imageUrl="https://a0.muscache.com/im/pictures/miso/Hosting-1039233709360808183/original/f6b8ac21-837e-465e-98d5-3755d14c33f1.jpeg?im_w=1200"
            
      />}
    </div>
  );
}

export default MakeBid;

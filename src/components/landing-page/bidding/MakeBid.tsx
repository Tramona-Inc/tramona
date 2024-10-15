import { Button } from "@/components/ui/button";
import { api } from "@/utils/api";
import { cn } from "@/utils/utils";
import { ChevronLeft } from "lucide-react";
import { useState } from "react";
import BiddingConfirmation from "./BiddingConfirmation";
import BiddingStep1 from "./BiddingStep1";
import BiddingStep2 from "./BiddingStep2";

function MakeBid({
  propertyId,
  setOpen,
}: {
  propertyId: number;
  setOpen: (open: boolean) => void;
}) {
  const { data: property } = api.properties.getById.useQuery({
    id: propertyId,
  });

  const [step, setStep] = useState(0);
  const [price, setPrice] = useState(0);

  // ! Later make the verification not skiappable
  // ! Uncomment to display verificaiton
  // const [message, setMessage] = useState("");
  // const { status, data: session, update } = useSession();
  // const verificationStatus = session?.user.isIdentityVerified;

  // useEffect(() => {
  //   switch (verificationStatus) {
  //     case "pending":
  //       void update();
  //       // setMessage(
  //       //   "Your identity verification is still pending. Please allow 2-3 minutes for processing. Contact support if this takes longer.",
  //       // );
  //       break;
  //     case "false":
  //       setMessage("To start making offers, help us verify your identity.");
  //       break;
  //     // case "true":
  //     //   setMessage(""); // Reset message if verified
  //     //   setCompleted(true); // Set completed to true
  //     //   break;
  //   }
  // }, [verificationStatus]);

  // // if (verificationStatus === "pending") {
  // //   void update();
  // // }

  // // if (verificationStatus === "false" || verificationStatus === "pending") {
  // if (verificationStatus === "false") {
  //   return (
  //     <>
  //       <div className="flex flex-col items-center">
  //         <h1 className="text-md font-semibold tracking-tight md:text-3xl">
  //           Identity Verification
  //         </h1>
  //         <div style={{ position: "relative", width: "50%", height: "200px" }}>
  //           <Image
  //             src="/assets/images/welcome/identity.png"
  //             alt="Identity Verification"
  //             fill
  //             quality={100}
  //             className="object-cover object-center"
  //           />
  //         </div>

  //         <div className="mx-auto max-w-md">
  //           <p className="my-2 break-words text-base text-black">{message}</p>
  //         </div>

  //         <hr className="mx-auto my-4 h-px w-[90%] border-0 bg-gray-300 md:my-10"></hr>
  //         <IdentityModal />
  //       </div>
  //     </>
  //   );
  // }

  return (
    <>
      {property && (
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
          {step === 0 && (
            <BiddingStep1
              property={property}
              setStep={setStep}
              setPrice={setPrice}
            />
          )}
          {step === 1 && (
            <BiddingStep2 property={property} setStep={setStep} price={price} />
          )}
          {step === 2 && (
            <BiddingConfirmation
              property={property}
              setOpen={setOpen}
              price={price}
            />
          )}
        </div>
      )}
    </>
  );
}

export default MakeBid;

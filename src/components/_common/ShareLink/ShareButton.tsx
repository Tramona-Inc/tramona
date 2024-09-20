import ShareOfferDialog from "./ShareOfferDialog";
import MobileShareButton from "./MobileShareButton";

//ONLY WORKS FOR PUBLIC OFFERS AND REQUEST
export default function ShareButton({
  id,
  isRequest,
  propertyName,
}: {
  id: number;
  isRequest: boolean;
  propertyName: string;
}) {
  return (
    <>
      <div className="contents sm:hidden">
        <MobileShareButton />
      </div>
      <div className="hidden sm:contents">
        <ShareOfferDialog
          id={id}
          isRequest={isRequest}
          propertyName={propertyName}
          showShare={true}
        />
      </div>
    </>
  );
}

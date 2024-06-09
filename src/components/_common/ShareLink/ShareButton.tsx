import ShareOfferDialog from "./ShareOfferDialog";
import MobileShareButton from "./MobileShareButton";
import { useMediaQuery } from "@/components/_utils/useMediaQuery";

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
  const isMobile = useMediaQuery("(max-width: 640px)");

  return isMobile ? (
    <MobileShareButton />
  ) : (
    <ShareOfferDialog
      id={id}
      isRequest={isRequest}
      propertyName={propertyName}
    />
  );
}

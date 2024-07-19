import RequestCityForm from "./RequestCityForm";
import AddAirbnbLink, {
  type AddAirbnbLinkRef,
} from "@/components/link-input/AddAirbnbLink";
import { Button } from "@/components/ui/button";
import { useState, useRef } from "react";

export default function DesktopRequestDealTab() {
  //handle which form is active
  const [isLinkActive, setIsLinkActive] = useState<boolean>(false);
  const cityFormRef = useRef();
  const airbnbFormRef = useRef<AddAirbnbLinkRef>();

  function handleActiveLink(val: boolean) {
    setIsLinkActive(val);
  }
  const handleSubmit = () => {
    if (isLinkActive && airbnbFormRef.current) {
      airbnbFormRef.current.handleExtractClick();
    } else if (cityFormRef.current) {
      cityFormRef.current.submit();
    }
  };

  return (
    <div className="flex flex-col gap-y-3">
      <RequestCityForm
        ref={cityFormRef}
        isLinkActive={isLinkActive}
        setIsLinkActive={handleActiveLink}
      />
      {isLinkActive && (
        <AddAirbnbLink
          ref={airbnbFormRef}
          setIsLinkActive={handleActiveLink}
          fromRequestDealTab={true}
        />
      )}
      <Button variant="greenPrimary" onClick={handleSubmit} className="mt-3">
        Submit Request
      </Button>
    </div>
  );
}

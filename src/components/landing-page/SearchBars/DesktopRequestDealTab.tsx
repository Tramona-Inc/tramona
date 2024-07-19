import RequestCityForm from "./RequestCityForm";
import AddAirbnbLink from "@/components/link-input/AddAirbnbLink";
import { useState } from "react";

export default function DesktopRequestDealTab() {
  //handle which form is active
  const [isLinkActive, setIsLinkActive] = useState<boolean>(false);

  function handleActiveLink() {
    setIsLinkActive(!isLinkActive);
  }

  return (
    <div>
      {/* <RequestCityForm showLink={showLink} /> */}
      <AddAirbnbLink
        isLinkActive={isLinkActive}
        setIsLinkActive={handleActiveLink}
        fromRequestDealTab={true}
      />
    </div>
  );
}

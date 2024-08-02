import Typewriter from "typewriter-effect";
import RequestCityForm, { type RequestCityFormRef } from "./RequestCityForm";
import AddAirbnbLink, {
  type AddAirbnbLinkRef,
} from "@/components/link-input/AddAirbnbLink";
import { Button } from "@/components/ui/button";
import { useState, useRef } from "react";

export default function CityRequestFormContainer() {
  //handle which form is active
  const [isLinkActive, setIsLinkActive] = useState<boolean>(false);
  const cityFormRef = useRef<RequestCityFormRef>(null);
  const airbnbFormRef = useRef<AddAirbnbLinkRef>(null);

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
    <div className="space-y-3">
      <p className="text-sm font-semibold text-muted-foreground lg:block">
        Send a request to every host in&nbsp;
        <br className="sm:hidden" />
        <span className="font-bold text-teal-900">
          <Typewriter
            component={"span"}
            options={{
              strings: ["LOS ANGELES", "PARIS", "MIAMI", "ANY CITY"],
              autoStart: true,
              loop: true,
            }}
          />
        </span>
      </p>
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
      <Button
        type="submit"
        size="lg"
        variant="greenPrimary"
        onClick={handleSubmit}
      >
        Submit Request
      </Button>
    </div>
  );
}

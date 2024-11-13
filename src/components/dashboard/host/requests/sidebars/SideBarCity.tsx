import type { HostRequestsPageData } from "@/server/api/routers/propertiesRouter";
import Link from "next/link";
export default // ---------- SIDEBAR CITY COMPONENT ----------
function SidebarCity({
  cityData,
  selectedOption,
  selectedCity,
  setSelectedCity,
}: {
  cityData: HostRequestsPageData;
  selectedOption: "normal" | "outsidePriceRestriction";
  selectedCity: string | null;
  setSelectedCity: (city: string) => void;
}) {
  const href =
    selectedOption === "normal"
      ? `/host/requests/${cityData.city}`
      : `/host/requests/${cityData.city}?priceRestriction=true`;

  const isSelected = selectedCity === cityData.city;

  return (
    <Link href={href} className="block">
      <div
        className={`flex items-center justify-between rounded-xl p-4 ${
          isSelected ? "bg-primaryGreen text-white" : ""
        }`}
        onClick={() => setSelectedCity(cityData.city)}
      >
        <div>
          <h3 className="font-medium">{cityData.city}</h3>
        </div>
        <div
          className={`text-sm ${isSelected ? "text-white" : "text-muted-foreground"}`}
        >
          {cityData.requests.length} requests
        </div>
      </div>
    </Link>
  );
}

import { ScrapersTrigger } from "./ScrapersTrigger";
import MakeUserHost from "./MakeUserHost";
import ViewRecentHosts from "./view-recent-host/ViewRecentHosts";

export default function AdminScrapers() {
  return (
    <div className="flex flex-col gap-4">
      <ScrapersTrigger />
    </div>
  );
}

import MakeUserHost from "./MakeUserHost";
import ViewRecentHosts from "./view-recent-host/ViewRecentHosts";

export default function AdminUtility() {
  return (
    <div className="flex flex-col gap-5">
      <MakeUserHost />
      <ViewRecentHosts />
    </div>
  );
}

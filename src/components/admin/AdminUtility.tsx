import { AddImageToUser } from "./AddImageToUser";
import { DeleteImage } from "./DeleteImage";
import MakeUserHost from "./MakeUserHost";
import ViewRecentHosts from "./view-recent-host/ViewRecentHosts";

export default function AdminUtility() {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="flex-1">
          <MakeUserHost />
        </div>
        <div className="flex-1">
          <DeleteImage />
        </div>
        <div className="flex-1">
          <AddImageToUser />
        </div>
      </div>
      <ViewRecentHosts />
    </div>
  );
}

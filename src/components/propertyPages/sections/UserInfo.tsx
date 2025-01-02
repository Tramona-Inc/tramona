import UserAvatar from "@/components/_common/UserAvatar";
import { CheckIcon } from "lucide-react";

export default function UserInfo({
  hostName,
  hostPic,
  hostDesc,
  hostLocation,
}: {
  hostName: string;
  hostPic: string | null;
  hostDesc: string | null;
  hostLocation: string | null;
}) {
  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-4">
        <div className="flex flex-col space-y-2">
          <div className="flex flex-col items-center space-y-2 rounded-lg p-4 shadow-lg">
            <UserAvatar name={hostName} image={hostPic} size={"lg"} />
            <div className="text-left">
              <p className="flex items-center gap-1">
                <CheckIcon className="h-4 w-4" />
                Email verified
              </p>
              <p className="flex items-center gap-1">
                <CheckIcon className="h-4 w-4" />
                Phone verified
              </p>
              <p className="flex items-center gap-1">
                <CheckIcon className="h-4 w-4" />
                Identity verified
              </p>
            </div>
          </div>
        </div>
        <div className="space-y-1">
          <div className="text-lg font-semibold">{hostName}</div>
          <div className="text-muted-foreground">Located in {hostLocation}</div>
          <div className="mt-2">
            <p>{hostDesc}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

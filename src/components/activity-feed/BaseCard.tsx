import { type MergedDataType } from "@/components/activity-feed/ActivityFeed";
import { Card, CardContent } from "../ui/card";
import {
  formatCurrency,
  formatDateRange,
  getElapsedTime,
  getDisplayedName,
  plural,
} from "@/utils/utils";
import ShareButton from "@/components/_common/ShareLink/ShareButton";
import UserAvatar from "../_common/UserAvatar";

export default function BaseCard({
  item,
  userName,
  userImage,
  children,
}: React.PropsWithChildren<{
  item: MergedDataType;
  userName: string;
  userImage: string;
}>) {
  const elapsedTime = item && getElapsedTime(new Date(item.createdAt));
  return (
    <Card className="block">
      <div className="flex items-center gap-4">
        <UserAvatar size="md" name={userName} image={userImage} />
        <div className="min-w-0 flex-1  font-medium">
          <div className="truncate">{getDisplayedName(userName) ?? ""}</div>
          <p className="truncate text-sm text-muted-foreground">
            {elapsedTime}
          </p>
        </div>
      </div>
      <CardContent className="space-y-2">
        {/* <div className="absolute right-2 top-0 flex items-center gap-2">
          <div className="mx-4  mt-5 flex h-full items-center justify-center">
            <ShareButton id={item?.id} isRequest={true} propertyName="TODO" />
          </div>
        </div> */}
        {children}
      </CardContent>
    </Card>
  );
}

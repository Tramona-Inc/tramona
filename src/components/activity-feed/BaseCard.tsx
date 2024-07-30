import { type FeedItem } from "@/components/activity-feed/ActivityFeed";
import { Card, CardContent } from "../ui/card";
import { getElapsedTime, getDisplayedName } from "@/utils/utils";
import UserAvatar from "../_common/UserAvatar";

export default function BaseCard({
  item,
  userName,
  userImage,
  children,
}: React.PropsWithChildren<{
  item: FeedItem | null;
  userName: string;
  userImage: string;
}>) {
  const elapsedTime = item && getElapsedTime(new Date(item.createdAt));
  const inPast = item && new Date(item.createdAt) < new Date();
  return (
    <Card className="w-full">
      <div className="flex items-center gap-4">
        <div>
          <UserAvatar size="md" name={userName} image={userImage} />
        </div>
        <div className="min-w-0 flex-1 font-medium">
          <div className="truncate font-bold">{getDisplayedName(userName)}</div>
          <p className="truncate text-sm text-muted-foreground">
            {inPast ? elapsedTime : "Today"}
          </p>
        </div>
      </div>
      <CardContent>
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

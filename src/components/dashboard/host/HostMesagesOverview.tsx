import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { MessageCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import UserAvatar from "@/components/_common/UserAvatar";

const fakeMessages = [
  {
    name: "Heidi",
    message:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore tempora fugit hic natus quos",
    id: 1,
  },
  {
    name: "Heidi",
    message:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore tempora fugit hic natus quos",
    id: 2,
  },
  {
    name: "Heidi",
    message:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Inventore tempora fugit hic natus quos",
    id: 3,
  },
];

export default function HostMessagesOverview({
  className,
}: {
  className?: string;
}) {
  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <MessageCircleIcon />
          <CardTitle>Messages</CardTitle>
          <Badge variant="secondary">4 new</Badge>
          <div className="flex-1" />
          <Button variant="ghost" asChild>
            <Link href="/messages">
              See all
              <ArrowRightIcon />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {fakeMessages.map((message) => (
            <div key={message.id} className="flex items-center gap-2">
              <UserAvatar name={message.name} />
              <div>
                <p className="font-semibold">{message.name}</p>
                <p className="line-clamp-1 text-sm text-muted-foreground">
                  {message.message}
                </p>
              </div>
              <div className="size-2 shrink-0 rounded-full bg-blue-500" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

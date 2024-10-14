import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { MessageCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import UserAvatar from "@/components/_common/UserAvatar";
import { api } from "@/utils/api";
import { useConversation } from "@/utils/store/conversations";
import { useEffect } from "react";
import supabase from "@/utils/supabase-client";
import { useSession } from "next-auth/react";

export default function HostMessagesOverview({
  className,
}: {
  className?: string;
}) {
  const { data: session } = useSession();
  const { data: fetchedConversations } = api.messages.getConversations.useQuery(
    undefined,
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  );
  const conversations = useConversation((state) => state.conversationList);
  const { setConversationList } = useConversation();
  useEffect(() => {
    // Check if data has been fetched and hasn't been processed yet

    if (fetchedConversations) {
      setConversationList(fetchedConversations);
    }

    const channel = supabase
      .channel(`fordashboardonly`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        () => setConversationList(fetchedConversations ?? []),
      )
      .subscribe();

    return () => {
      void channel.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchedConversations]);

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <MessageCircleIcon />
          <CardTitle>Messages</CardTitle>
          <Badge variant="secondary">
            {conversations.filter((m) => m.messages[0]?.read === false).length}{" "}
            new
          </Badge>
          <div className="flex-1" />
          <Button variant="ghost" asChild>
            <Link href="/host/messages">
              See all
              <ArrowRightIcon />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {conversations.filter(
            (m) =>
              m.messages[0]?.read === false &&
              m.participants[0]?.id !== session?.user.id,
          ).length > 0 ? (
            conversations.map((conversation) => (
              <div key={conversation.id} className="flex items-center gap-2">
                {conversation.messages[0]?.read === false &&
                  conversation.participants[0]?.id !== session?.user.id && (
                    <>
                      <UserAvatar name={conversation.participants[0]?.image} />
                      <div>
                        <p className="font-semibold">
                          {conversation.participants[0]?.name}
                        </p>
                        <p className="line-clamp-1 text-sm text-muted-foreground">
                          {conversation.messages[0]?.message}
                        </p>
                      </div>
                      <div className="flex-1" />
                      <div className="size-2 shrink-0 rounded-full bg-blue-500" />
                    </>
                  )}
              </div>
            ))
          ) : (
            <div className="flex-1 items-center justify-center">
              <p className="text-black">No new messages</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

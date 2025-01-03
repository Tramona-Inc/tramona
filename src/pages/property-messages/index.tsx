import ConversationsEmptySvg from "@/components/_common/EmptyStateSvg/ConversationsEmptySvg";
import EmptyStateValue from "@/components/_common/EmptyStateSvg/EmptyStateValue";
import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import Spinner from "@/components/_common/Spinner";
import NavLink from "@/components/_utils/NavLink";
import type { RouterOutputs } from "@/utils/api";
import { api } from "@/utils/api";
import { cn, formatRelativeDateShort } from "@/utils/utils";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { ReactNode } from "react";

function TravelerConversationLink({
  convo,
}: {
  convo: RouterOutputs["propertyMessages"]["getTravelerConversations"][number];
}) {
  return (
    <NavLink
      href={`/property-messages/${convo.id}`}
      render={({ selected }) => (
        <div
          className={cn(
            "flex gap-2 px-2 py-1",
            selected ? "bg-zinc-100" : "hover:bg-zinc-50",
          )}
        >
          <Image
            src={convo.property.imageUrls[0]!}
            alt={convo.property.name}
            width={80}
            height={80}
            className="h-16 w-16 shrink-0 rounded-md object-cover"
          />
          <div className="flex-1 space-y-1">
            <div className="flex">
              <p className="flex-1 truncate text-sm font-bold">
                {convo.property.name}
              </p>
              <span className="text-xs text-zinc-500">
                {formatRelativeDateShort(convo.latestMessage.createdAt, {
                  withSuffix: true,
                })}
              </span>
            </div>
            <p className="line-clamp-2 text-sm text-zinc-500">
              <b className="font-semibold">
                {convo.latestMessage.authorId === convo.travelerId
                  ? "You: "
                  : ""}
              </b>
              {convo.latestMessage.message}
            </p>
          </div>
        </div>
      )}
    />
  );
}

export function MessagesLayout({ children }: { children?: ReactNode }) {
  const { data: convos } =
    api.propertyMessages.getTravelerConversations.useQuery();

  useSession({ required: true });

  return (
    <DashboardLayout noFooter noBanner>
      <div className="flex h-screen-minus-header overflow-hidden">
        <div className="flex-1 border-r bg-white md:w-80 md:flex-none">
          <div className="flex h-16 items-center border-b px-4">
            <h1 className="text-2xl font-bold">Messages</h1>
          </div>
          <div>
            {!convos ? (
              <Spinner />
            ) : convos.length === 0 ? (
              <EmptyStateValue description="No conversations yet">
                <ConversationsEmptySvg />
              </EmptyStateValue>
            ) : (
              convos.map((convo) => (
                <TravelerConversationLink key={convo.id} convo={convo} />
              ))
            )}
          </div>
        </div>
        <div className="hidden flex-1 md:block">{children}</div>
      </div>
    </DashboardLayout>
  );
}

export default function Page() {
  return (
    <MessagesLayout>
      <div className="flex min-h-screen-minus-header flex-col items-center justify-center">
        <EmptyStateValue description="Select a conversation to read more">
          <ConversationsEmptySvg />
        </EmptyStateValue>
      </div>
    </MessagesLayout>
  );
}

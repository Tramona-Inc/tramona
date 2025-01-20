import React, { useMemo } from "react";
import { type Conversation } from "@/utils/store/conversations";
import { format } from "date-fns";
import { useSession } from "next-auth/react";

interface SelectedConversationSidebarProps {
  conversation: Conversation;
}

const SelectedConversationSidebar: React.FC<SelectedConversationSidebarProps> = ({ conversation }) => {
  const { data: session } = useSession();

  const participants = useMemo(() => {
    return conversation.participants.filter((p: { id: string }) => p.id !== session?.user.id);
  }, [conversation.participants, session]);

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Header */}
      <h2 className="mb-2 text-xl font-semibold">
        {conversation.name ??
          participants.map((p) => p.name).join(", ") ??
          "Conversation"}
      </h2>

      {conversation.name && (
        <div className="text-sm text-muted-foreground">
          <p>Conversation ID: {conversation.id}</p>
        </div>
      )}

      {/* Participants Section */}
      {participants && participants.length > 0 && (
        <div>
          <h3 className="text-md mb-2 font-semibold">Participants:</h3>
          <ul className="text-sm">
            {participants.map((participant) => (
              <li key={participant.id}>{participant.name}</li>
            ))}
          </ul>
        </div>
      )}
      {/* Created Date Section */}
      <div className="text-sm text-muted-foreground">
        <p>
          Created At:{" "}
          {conversation.createdAt
            ? format(new Date(conversation.createdAt), "MMMM dd, yyyy h:mm a")
            : "N/A"}
        </p>
      </div>
    </div>
  );
};

export default SelectedConversationSidebar;

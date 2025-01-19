import { useChatWithHostTeam } from "@/utils/messaging/useChatWithHost";

export default function ChatWithHost({ hostId, hostTeamId, propertyId }: { hostId: string, hostTeamId: number, propertyId: string }) {
  const chatWithHostTeam = useChatWithHostTeam();

  return (
    <p className="text-sm">
      Questions?{" "}
      <button
        onClick={() => chatWithHostTeam({
          hostId,
          hostTeamId,
          propertyId
        })}
        className="text-blue-600 underline underline-offset-2"
      >
        Chat with host
      </button>
    </p>
  );
}

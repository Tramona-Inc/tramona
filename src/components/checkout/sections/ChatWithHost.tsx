import { useChatWithAdmin } from "@/utils/messaging/useChatWithAdmin";

export default function ChatWithHost() {
  const chatWithAdmin = useChatWithAdmin();

  return (
    <p className="text-sm">
      Questions?{" "}
      <button
        onClick={() => chatWithAdmin()}
        className="text-blue-600 underline underline-offset-2"
      >
        Chat with host
      </button>
    </p>
  );
}

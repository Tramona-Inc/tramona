import { api } from "@/utils/api";
import {
  type ChatMessageType,
  useMessage,
} from "@/utils/store/messages";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import {
  type MessageDbType,
} from "@/types/supabase.message";
import supabase from "@/utils/supabase-client";

// export default function AdminMessages ({conversationId}:{
//   conversationId: string | null
// }) {
let tempToken: string;
export default function ListMessagesWithAdmin() {
  const { data: session } = useSession();

  if (!session && typeof window !== "undefined") {
    tempToken = localStorage.getItem("tempToken") ?? "";
  }
  // console.log(tempToken)
  const { data: conversationId } =
    api.messages.getConversationsWithAdmin.useQuery({
      userId: session?.user.id || "",
    });
  // console.log(conversationId)

  const { fetchInitialMessages } = useMessage();
    void fetchInitialMessages(conversationId ?? "");
  const { conversations } = useMessage();

  const addMessageToConversation = useMessage(
    (state) => state.addMessageToConversation,
  );

  const optimisticIds = useMessage((state) => state.optimisticIds);
  // const setOptimisticIds = useMessage((state) => state.setOptimisticIds);

  const messages = conversationId
    ? (conversations[conversationId]?.messages ?? [])
    : [];

//   const handlePostgresChangeOnGuest = async (payload: {
//     new: ChatMessageType;
//   }) => {
//     console.log("in AdminMessages->handlePostgresChangeOnGuest")
//     if (!optimisticIds.includes(payload.new.id)) {
//       const newMessage: ChatMessageType = {
//         id: payload.new.id,
//         conversationId: payload.new.conversation_id,
//         userToken: payload.new.user_token ?? "",
//         message: payload.new.message,
//         isEdit: payload.new.is_edit,
//         createdAt: payload.new.created_at,
//         read: payload.new.read,
//         // userId: "",
//       };
//       addMessageToAdminConversation(payload.new.conversation_id, newMessage);
//     }
//   };

  useEffect(() => {
    if(session){
      const channel = supabase
        .channel(`${conversationId}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "messages",
          },
          (payload: { new: MessageDbType }) => {
            // console.log(payload)
            void handlePostgresChange(payload);
          },
        )
        .subscribe();
  
  
      // console.log("going or no?");
      return () => {
        // console.log("unsubscibing from channel");
        void channel.unsubscribe();
      };
    }
    console.log("handling postgres change for logged in user");
    console.log(conversationId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase, messages]);

  const handlePostgresChange = async (payload: { new: MessageDbType }) => {
    console.log("coming to handlePostgresChange");
    if (!optimisticIds.includes(payload.new.id)) {
      const newMessage: ChatMessageType = {
        id: payload.new.id,
        conversationId: payload.new.conversation_id,
        userId: payload.new.user_id ?? "",
        message: payload.new.message,
        isEdit: payload.new.is_edit,
        createdAt: payload.new.created_at,
        read: payload.new.read,
      };
      addMessageToConversation(payload.new.conversation_id, newMessage);
      // setOptimisticIds(newMessage.id)
    }
  };

//   useEffect(() => {
//     console.log("in AdminMessages", conversationId)
//     if(!session){
//       const channel = supabase
//         .channel(`${conversationId}`)
//         .on(
//           "postgres_changes",
//           {
//             event: "INSERT",
//             schema: "public",
//             table: "guest_messages",
//           },
//           (payload: { new: ChatMessageType }) =>
//             void handlePostgresChangeOnGuest(payload),
//         )
//         .subscribe();
  
//       return () => {
//         void channel.unsubscribe();
//       };
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [supabase, adminMessages]);

  return (
    <>
      {session ? (
        messages.length > 0 ? (
          <div className="flex w-full flex-1 flex-col-reverse gap-1 overflow-y-scroll p-3">
            {messages.map((message, index) =>
              "userId" in message && message.userId === session.user.id ? (
                <>
                  <div className="m-1 flex flex-row-reverse p-1" key={index}>
                    <p className="h-max max-w-[15rem] rounded-l-xl rounded-tr-xl border-none bg-[#1A84E5] px-2 py-2 text-sm text-white antialiased">
                      {message.message}
                      {/* <span className='text-xs pl-4 text-right'>{`${hours}:${minutes}`}</span> */}
                    </p>
                  </div>
                </>
              ) : (
                <div className="m-1 flex place-items-end p-1" key={index}>
                  <p className="h-max max-w-[15rem] rounded-r-xl rounded-tl-xl border-none bg-[#2E2E2E] px-2 py-2 text-sm text-background text-white antialiased">
                    {message.message}
                  </p>
                </div>
              ),
            )}
          </div>
        ) : (
          <div className="flex w-full flex-1">
            <p className="m-auto flex items-center justify-center text-[#8B8B8B]">
              How can we help you?
            </p>
          </div>
        )
      ) : (
        <div className="flex w-full flex-1">
          <p className="m-auto flex items-center justify-center text-[#8B8B8B]">
            How can we help you?
          </p>
        </div>
      )}
    </>
  );
}
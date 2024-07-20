import { api } from "@/utils/api"
import { type ChatMessageType, type GuestMessage, useMessage } from "@/utils/store/messages";
import { useSession } from "next-auth/react";
import { ScrollArea } from "../ui/scroll-area";
import { useConversation } from "@/utils/store/conversations";
import { useEffect } from "react";
import { type MessageDbType, type GuestMessageType } from "@/types/supabase.message";
import supabase from "@/utils/supabase-client";
import { fetchGuestConversation } from "@/server/api/routers/messagesRouter";

// export default function AdminMessages ({conversationId}:{
//   conversationId: string | null
// }) {
  export default function AdminMessages (
  )  {  
  const {data: session} = useSession();
  let tempToken: string = "";
  if(!session && typeof window !== "undefined"){
    tempToken = localStorage.getItem("tempToken") ?? "";
  }
  // console.log(tempToken)
  const {data: conversationId} = api.messages.getConversationsWithAdmin.useQuery({
    uniqueId: session?.user.id ?? tempToken ?? "",
    session: session ? true : false,
  })
  // console.log(conversationId)


  const { fetchMessagesForGuest, fetchInitialMessages } = useMessage()
  if(!session || session.user.role === "admin") {
    void fetchMessagesForGuest(conversationId ?? "")
    // void fetchInitialMessages(conversationId ?? "")
  }
  else {
    void fetchInitialMessages(conversationId ?? "")
  }

  const { conversations } = useMessage();
  const { adminConversations } = useMessage();

  const addMessageToConversation = useMessage(
    (state) => state.addMessageToConversation
  )

  const addMessageToAdminConversation = useMessage(
    (state) => state.addMessageToAdminConversation
  )

  const optimisticIds = useMessage((state) => state.optimisticIds);
  const setOptimisticIds = useMessage((state) => state.setOptimisticIds);

  const messages = conversationId ?
  conversations[conversationId]?.messages ?? [] : [];

  const adminMessages = conversationId 
  ? adminConversations[conversationId]?.messages ?? []
    : [];

    const handlePostgresChangeOnGuest = async (payload: { new: GuestMessageType }) => {
      if(!optimisticIds.includes(payload.new.id)){
        const newMessage: ChatMessageType | GuestMessage = {
          id: payload.new.id,
          conversationId: payload.new.conversation_id,
          userToken:payload.new.user_token,
          message: payload.new.message,
          isEdit: payload.new.is_edit,
          createdAt: payload.new.created_at,
          read: payload.new.read,
          // userId: "",
        };
        addMessageToAdminConversation(payload.new.conversation_id, newMessage)
      }
    // }
  // }        
  }

  useEffect(() => {
    console.log("handling postgres change for logged in user");
    console.log(conversationId);
    const channel = supabase
      .channel(`${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        (payload: { new: MessageDbType}) => {
          console.log(payload)
          void handlePostgresChange(payload)},
      )
      .subscribe();
      
    console.log("going or no?");
    return () => {
      console.log("unsubscibing from channel");
      void channel.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId, messages]);
  
  const handlePostgresChange = async (payload: { new: MessageDbType }) => {
    console.log("coming to handlePostgresChange")
    if(optimisticIds.includes(payload.new.id)) {
        const newMessage: ChatMessageType & GuestMessage = {
          id: payload.new.id,
          conversationId: payload.new.conversation_id,
          userId: payload.new.user_id ?? "",
          // userToken:payload.new.user_token,
          message: payload.new.message,
          isEdit: payload.new.is_edit,
          createdAt: payload.new.created_at,
          read: payload.new.read,
          userToken: "",
        };
        addMessageToConversation(payload.new.conversation_id, newMessage)
        // setOptimisticIds(newMessage.id)      
    }
  }

useEffect(() => {
  const channel = supabase
    .channel(`${conversationId}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "guest_messages",
      },
      (payload: { new: GuestMessageType}) => void handlePostgresChangeOnGuest(payload),
    )
    .subscribe();

  return () => {
    void channel.unsubscribe();
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [adminMessages]);
    



    return(
    <>
    {session ? (messages.length > 0 ? 
              <div className="flex flex-1 w-full overflow-y-scroll flex-col-reverse gap-1 p-3">
                  
                  { (messages.map((message, index) => ( "userId" in message && message.userId === session?.user.id ?
                    <>
                    <div className="flex flex-row-reverse m-1 p-1" key={index}>
                      <p className="px-2 py-2 border-none bg-[#1A84E5] text-sm text-white rounded-l-xl rounded-tr-xl max-w-[15rem] h-max antialiased">
                        {message.message} 
                        {/* <span className='text-xs pl-4 text-right'>{`${hours}:${minutes}`}</span> */}
                      </p>
                      </div>
                    </>
                    :
                    <div className="flex place-items-end m-1 p-1" key={index}>
                      <p  className="px-2 py-2 border-none rounded-r-xl rounded-tl-xl bg-[#2E2E2E] text-sm text-white text-background max-w-[15rem] h-max antialiased">
                    {message.message}
                  </p>
                </div>)))
                  }
              </div>
              :
              <div className="flex flex-1 w-full">
                <p className="flex m-auto text-[#8B8B8B] items-center justify-center">How can we help you?</p>
              </div>)
              :
              adminMessages.length > 0 ?
              <div className="flex flex-1 w-full overflow-y-scroll flex-col-reverse gap-1 p-3">
              {(adminMessages.map((message, index) => ("userToken" in message && message.userToken === tempToken ? 
                <>
                    <div className="flex flex-row-reverse m-1 p-1" key={index}>
                      <p className="px-2 py-2 border-none bg-[#1A84E5] text-sm text-white rounded-l-xl rounded-tr-xl max-w-[15rem] h-max antialiased">
                        {message.message} 
                        {/* <span className='text-xs pl-4 text-right'>{`${hours}:${minutes}`}</span> */}
                      </p>
                      </div>
                </>
                :
                <div className="flex place-items-end m-1 p-1" key={index}>
                  <p  className="px-2 py-2 border-none rounded-r-xl rounded-tl-xl bg-[#2E2E2E] text-sm text-white text-background max-w-[15rem] h-max antialiased">
                    {message.message}
                  </p>
                </div>
              )))}
              </div>
              :
              <div className="flex flex-1 w-full">
                <p className="flex m-auto text-[#8B8B8B] items-center justify-center">How can we help you?</p>
              </div>
            }
    </>
    )
}
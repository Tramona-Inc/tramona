import { api } from "@/utils/api"
import { ChatMessageType, useMessage } from "@/utils/store/messages";
import { useSession } from "next-auth/react";
import { ScrollArea } from "../ui/scroll-area";
import { useConversation } from "@/utils/store/conversations";
import { useEffect } from "react";

// export default function AdminMessages ({conversationId}:{
//   conversationId: string | null
// }) {
  export default function AdminMessages (){  
  const {data: session} = useSession();
  let tempToken: string = "";
  if(!session && typeof window !== undefined){
    tempToken = localStorage.getItem("tempToken") ?? "";
  }
  console.log(tempToken)
  const {data: conversationId} = api.messages.getConversationsWithAdmin.useQuery({
    uniqueId: session?.user.id ?? tempToken ?? "",
    session: session ? true : false,
  })
  console.log(conversationId)


  const { fetchMessagesForGuest, fetchInitialMessages } = useMessage()
  if(!session) {
    void fetchMessagesForGuest(conversationId ?? "")
  }
  else {
    void fetchInitialMessages(conversationId ?? "")
  }
  const { conversations } = useMessage();

  
  
  const optimisticIds = useMessage((state) => state.optimisticIds);
    const messages = conversationId 
    ? conversations[conversationId]?.messages ?? []
    : [];

    console.log(messages)

    return(
    <>
              {/* <div className="grow grid grid-rows-1 overflow-y-scroll"> */}
              <div className="flex flex-1 w-full overflow-y-scroll flex-col-reverse gap-1 p-3">
                  {/* <UserAvatar className="my-2" image={session?.user.image}/> */}
                  {/* {messageByUser.map((message, index) => (
  
                <div className="flex flex-row-reverse m-1 p-1" key={index}>
                <p className="px-2 py-2 border-none bg-[#1A84E5] text-sm text-white rounded-l-xl rounded-tr-xl max-w-[15rem] h-max antialiased">
                    {message.message} */}
                    {/* <span className='text-xs pl-4 text-right'>{`${hours}:${minutes}`}</span> */}
                  {/* </p>
                </div>
                  ))} */}
                  {/* {messageBySender.map((message, index) => (
                <div className="flex place-items-end m-1 p-1" key={index}>
                  <p  className="px-2 py-2 border-none rounded-r-xl rounded-tl-xl bg-[#2E2E2E] text-sm text-white text-background max-w-[15rem] h-max antialiased">
                    {message.message}
                  </p>
                </div>
                  ))} */}
                  {/* {!session &&
                    <div className="flex flex-row-reverse m-1 p-1">
                    <p className="px-2 py-2 border-none bg-[#1A84E5] text-sm text-white rounded-l-xl rounded-tr-xl max-w-[15rem] h-max antialiased">
                       */}
                      {/* <span className='text-xs pl-4 text-right'>{`${hours}:${minutes}`}</span> */}
                    {/* </p>
                    </div> */}
                  {/* } */}
                  {messages.map((message, index) => ( "userId" in message && message.userId === session?.user.id || "userToken" in message && message.userToken === tempToken ?
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
                  ))}
                {/* <UserAvatar image={session?.user.image}/> */}
                {/* {conversation.} */}
              </div>
    </>
    )
}
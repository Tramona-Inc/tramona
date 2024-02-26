// import supabase from "@/utils/supabase-client";
// import { useEffect } from "react";
// import { Button } from "../ui/button";
// import { getFromAndTo } from '@/utils/utils';
// import { LIMIT_MESSAGE } from './ChatMessages';
// import { useMessage } from '@/utils/store/messages';

// export default function LoadMoreMessages() {
//   const page = useMessage((state) => state.page);

//   // Fetch conversation on the client
//   useEffect(() => {
//     const fetchConversation = async () => {
//       const { from, to } = getFromAndTo(page, LIMIT_MESSAGE);

//       try {
//         const { data, error } = await supabase
//           .from("messages")
//           .select(
//             `
//             *,
//             user(name, image, email)
//           `,
//           )
//           .range(0, LIMIT_MESSAGE)
//           .eq("conversation_id", conversationId)
//           .order("created_at", { ascending: false });

//         if (data) {
//           const chatMessages: ChatMessageType[] = data.map((message) => ({
//             conversationId: message.conversation_id,
//             id: message.id,
//             createdAt: new Date(message.created_at),
//             userId: message.user_id,
//             message: message.message,
//             read: message.read,
//             isEdit: message.is_edit,
//             user: {
//               name: message.user?.name ?? "",
//               image: message.user?.image ?? "",
//               email: message.user?.email ?? "",
//             },
//           }));

//           setMessages(chatMessages);
//           setInitConversationMessages(conversationId, chatMessages);
//         }
//         if (error) {
//           throw error;
//         }
//       } catch (error) {
//         console.log(error);
//       }
//     };

//     void fetchConversation();
//   }, [conversationId]);

//   return (
//     <div className="absolute top-5 z-10 flex w-full items-center justify-center">
//       <Button
//         variant={"darkPrimary"}
//         className="mx-10 w-full transition-all hover:scale-110"
//       >
//         Load More
//       </Button>
//     </div>
//   );
// }

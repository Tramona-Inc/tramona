// import { useRouter } from "next/router";
// import { api } from "@/utils/api";
// import { type TRPCError } from "@trpc/server";

// export function HostInitiateChat({ travelerId }: { travelerId: string }) {
//   const router = useRouter();
//   const { mutateAsync: createConversation } =
//     api.messages.createConversationHostWithUser.useMutation();

//   const handleClick = async () => {
//     try {
//       const conversation = await createConversation({ userId: travelerId });
//       void router.push(`/host/messages?conversationId=${conversation.id}`);
//     } catch (error) {
//       const tRPCError = error as TRPCError;
//       console.error("Failed to create conversation:", tRPCError.message);
//     }
//   };

//   return <button onClick={() => void handleClick()}>Message Traveler</button>;
// }

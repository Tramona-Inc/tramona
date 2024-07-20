import MessagesPopover from '@/components/messages/MessagesPopover'
import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import { useSession } from 'next-auth/react';
import UserAvatar from '@/components/_common/UserAvatar'
import AdminMessages from "@/components/messages/AdminMessages";
import { api } from '@/utils/api';
import { useMessage } from '@/utils/store/messages';
import { useIsMd, useIsLg } from '@/utils/utils';



let tempToken: string;
export default function AdminMessagesPage() {
  const {data: session} = useSession();

  const {mutateAsync: createConversation} = api.messages.createConversationWithAdmin.useMutation();
  const isMd = useIsMd();

  if (!session && typeof window !== "undefined") {
    tempToken = localStorage.getItem("tempToken") ?? "";
    if (!tempToken) {
      tempToken = crypto.randomUUID();
      localStorage.setItem("tempToken", tempToken);
    }
  }

  const {data: conversationId} = api.messages.getConversationsWithAdmin.useQuery({
    uniqueId: session?.user.id ?? tempToken ?? "",
    session: session ? true : false,
  })

  //  const { fetchInitialMessages } = useMessage()
  // void fetchInitialMessages(conversationId ?? "")
  // const isMobile = useMediaQuery("(max-width:648px)")

    return (
        <DashboardLayout type={session?.user.role ?? "guest"}>
         {isMd && <MessagesPopover />}
        </DashboardLayout>
    )
}
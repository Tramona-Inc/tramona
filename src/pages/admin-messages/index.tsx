import MessagesPopover from '@/components/messages/MessagesPop'
import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import { useSession } from 'next-auth/react';
import { useIsLg } from '@/utils/utils';



let tempToken: string;
export default function AdminMessagesPage() {
  const {data: session} = useSession();
  const isLg = useIsLg();

  if (!session && typeof window !== "undefined") {
    tempToken = localStorage.getItem("tempToken") ?? "";
    if (!tempToken) {
      tempToken = crypto.randomUUID();
      localStorage.setItem("tempToken", tempToken);
    }
  }

  //  const { fetchInitialMessages } = useMessage()
  // void fetchInitialMessages(conversationId ?? "")
  // const isMobile = useMediaQuery("(max-width:648px)")

    return (
        <DashboardLayout type={session?.user.role ?? "guest"}>
         {!isLg && <MessagesPopover />}
        </DashboardLayout>
    )
}
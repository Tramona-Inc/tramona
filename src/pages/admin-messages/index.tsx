import MessagesPopover from '@/components/messages/MessagesPopover'
import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import { useSession } from 'next-auth/react';
import UserAvatar from '@/components/_common/UserAvatar'
import AdminMessages from "@/components/messages/AdminMessages";



export default function AdminMessagesPage() {
    const {data: session} = useSession();
    return (
        <DashboardLayout type={session?.user.role ?? "guest"}>
            <MessagesPopover session={session}/>
      </DashboardLayout>
    )
}
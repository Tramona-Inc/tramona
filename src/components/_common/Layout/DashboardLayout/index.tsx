import MobileNav from "@/components/dashboard/MobileNav";
import Sidebar from "@/components/dashboard/Sidebar";
import { useSession } from "next-auth/react";
import Header from "../../Header";
import Footer from "../DesktopFooter";
import { Button } from "@/components/ui/button";
import { Session, Chatbox } from '@talkjs/react'
import { useIsMd } from "@/utils/utils";
import {MessageCircleMore} from 'lucide-react'
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

type DashboardLayoutProps = {
  children: React.ReactNode;
  type: "admin" | "host" | "guest" | "unlogged";
};

export default function DashboardLayout({
  children,
  type,
}: DashboardLayoutProps) {
  const { data: session } = useSession();
  const isMd = useIsMd();
  return (
    <>
      <Header type={session ? "dashboard" : "marketing"} sidebarType={type} />
      <div className="relative min-h-screen-minus-header lg:flex">
        {session && (
          <aside className="sticky top-header-height hidden h-screen-minus-header bg-zinc-100 lg:block">
            <Sidebar type={type} />
          </aside>
        )}
        <div className="lg:flex-1">
          <main className="relative min-h-screen-minus-header">{children}</main>
          {session ? (
            <MobileNav type={type} />
          ) : (
            <MobileNav type={"unlogged"} />
          )}
          <div className="fixed bottom-10 right-4 z-50">
            <Popover>
              <PopoverTrigger asChild>
            <Button className="border rounded-full p-4 w-18 h-18">
              <MessageCircleMore />
            </Button>
              </PopoverTrigger>  
              <PopoverContent align="start" className="relative w-[22rem] h-[40rem]">
              <Session appId="tIu0KQUE" userId="sample_user_alice">
                <Chatbox
                  conversationId="sample_conversation"
                  className="w-full h-full"
                ></Chatbox>
              </Session>
              </PopoverContent>            
            </Popover>
          </div>
          {isMd && <Footer />}
        </div>
      </div>
    </>
  );
}

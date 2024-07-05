import MobileNav from "@/components/dashboard/MobileNav";
import Sidebar from "@/components/dashboard/Sidebar";
import { useSession } from "next-auth/react";
import Header from "../../Header";
import Footer from "../DesktopFooter";
import { useIsMd } from "@/utils/utils";
import { useMediaQuery } from "@/components/_utils/useMediaQuery";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import MessagesPopover from "@/components/messages/MessagesPopover";



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
  const isMobile = useMediaQuery("(max-width: 684px)")
  const formSchema = z.object({
    message: z.string(),
  })
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema)
  })
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
          {!isMobile && 
          <MessagesPopover session={session}/>
          }
          {isMd && <Footer />}
        </div>
      </div>
    </>
  );
}

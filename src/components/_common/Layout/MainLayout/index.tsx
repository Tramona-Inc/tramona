import { cn } from "@/utils/utils";
import { Session, Chatbox } from '@talkjs/react'
import React from "react";
import Header from "../../Header";
import Footer from "../DesktopFooter";
import { Button } from "@/components/ui/button";
import {MessageCircleIcon} from 'lucide-react'

type MainLayoutProps = {
  className?: string;
  children: React.ReactNode;
  type?: "marketing" | "auth";
};

function Chat() {
  return 
  <Session appId="tIu0KQUE" userId="sample_user_alice"></Session>
}

export default function MainLayout({
  className,
  children,
  type,
}: MainLayoutProps) {
  return (
    
    <div vaul-drawer-wrapper="">
      {type === "auth" ? (
        <Header type="dashboard" sidebarType="guest" />
      ) : (
        <Header type="marketing" />
      )}
      <main className={cn("min-h-screen-minus-header bg-white", className)}>
        {children}
      </main>
      <div className="sticky bottom-0 right-10 z-50">
      <Button >
        <MessageCircleIcon />
      <Session appId="tIu0KQUE" userId="sample_user_alice">
        <Chatbox
          conversationId="sample_conversation"
          style={{ width: "100%", height: "500px" }}
        ></Chatbox>
      </Session>
      </Button>
      </div>
      <Footer />
    </div>
  );
}

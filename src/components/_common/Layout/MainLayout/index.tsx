import { cn } from "@/utils/utils";
import React from "react";
import Header from "../../Header";
import Footer from "../DesktopFooter";

type MainLayoutProps = {
  className?: string;
  children: React.ReactNode;
};

export default function MainLayout({ className, children }: MainLayoutProps) {
  return (
    <div vaul-drawer-wrapper="">
      <Header />
      <main className={cn("min-h-screen-minus-header", className)}>
        {children}
      </main>
      <Footer />
    </div>
  );
}

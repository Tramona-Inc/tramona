import { cn } from "@/utils/utils";
import React from "react";
import { Header } from "../header/Header";
import Footer from "../Footer";

type MainLayoutProps = {
  className?: string;
  children: React.ReactNode;
};

export default function MainLayout({ className, children }: MainLayoutProps) {
  return (
    <div
      vaul-drawer-wrapper=""
      className="relative flex min-h-screen flex-col bg-background"
    >
      <Header />
      <main className={cn("min-h-screen-minus-header flex-grow", className)}>
        {children}
      </main>
      <Footer />
    </div>
  );
}

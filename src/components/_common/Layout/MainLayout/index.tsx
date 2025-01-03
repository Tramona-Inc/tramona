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
    <div vaul-drawer-wrapper="" className="flex flex-col min-h-screen">
      <Header />
      <main className={cn("flex-grow min-h-screen-minus-header", className)}>
        {children}
      </main>
      <Footer />
    </div>
  );
}

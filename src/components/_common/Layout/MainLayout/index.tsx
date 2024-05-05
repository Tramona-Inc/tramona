import { cn } from "@/utils/utils";
import React from "react";
import Header from "../../Header";
import Footer from "../Footer";

type MainLayoutProps = {
  className?: string;
  children: React.ReactNode;
  type?: "marketing" | "auth";
};

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
      <main
        className={cn("min-h-screen-minus-header bg-white", className)}
      >
        {children}
      </main>
      <Footer />
    </div>
  );
}

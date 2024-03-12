import React from "react";
import Header from "../../Header";
import Footer from "../Footer";

type MainLayoutProps = {
  children: React.ReactNode;
  type?: "marketing" | "auth";
};

export default function MainLayout({ children, type }: MainLayoutProps) {
  return (
    <div vaul-drawer-wrapper="">
      {type === "auth" ? (
        <Header type="dashboard" />
      ) : (
        <Header type="marketing" />
      )}
      <main className="bg-background min-h-screen-minus-header">{children}</main>
      <Footer />
    </div>
  );
}

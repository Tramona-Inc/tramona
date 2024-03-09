import Header from "./Header";
import Footer from "./Footer";

export default function MainLayout({ children }: React.PropsWithChildren) {
  return (
    <div vaul-drawer-wrapper="">
      <Header />
      <main className="min-h-screen flex-1 bg-background pt-[--header-height]">
        {children}
      </main>
      <Footer />
    </div>
  );
}

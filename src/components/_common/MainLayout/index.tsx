import Footer from "./Footer";
import Header from "./Header";

export default function MainLayout({ children }: React.PropsWithChildren) {
  return (
    <div vaul-drawer-wrapper="">
      <Header />
      <main className="min-h-screen flex-1 bg-background">{children}</main>
      <Footer />
    </div>
  );
}

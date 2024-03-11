import Footer from "./Footer";
import Header from "./Header";

export default function MainLayout({ children }: React.PropsWithChildren) {
  return (
    <div vaul-drawer-wrapper="">
      <Header />
      <main className="bg-background">{children}</main>
      <Footer />
    </div>
  );
}

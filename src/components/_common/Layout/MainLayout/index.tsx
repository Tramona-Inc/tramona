import Header from "../../Header";
import Footer from "../Footer";

export default function MainLayout({ children }: React.PropsWithChildren) {
  return (
    <div vaul-drawer-wrapper="">
      <Header type="marketing" />
      <main className="bg-background">{children}</main>
      <Footer />
    </div>
  );
}

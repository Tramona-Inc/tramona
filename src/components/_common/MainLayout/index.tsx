import Footer from "./Footer";
import Header from "./Header";

export default function MainLayout({ children }: React.PropsWithChildren) {
  return (
    <div vaul-drawer-wrapper="">
      <Header />
      <main className="sm:-mt-header -mt-header-sm flex min-h-screen flex-grow bg-background">
        {children}
      </main>
      <Footer />
    </div>
  );
}

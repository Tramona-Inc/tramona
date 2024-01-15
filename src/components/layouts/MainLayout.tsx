import Header from "../Header";
import Footer from "../Footer";

export default function MainLayout({ children }: React.PropsWithChildren) {
  return (
    <>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">{children}</main>
      </div>
      <Footer />
    </>
  );
}

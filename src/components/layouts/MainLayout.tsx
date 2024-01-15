import Header from "../Header";
import Footer from "../Footer";
import Head from "next/head";

export default function MainLayout({
  children,
  pageTitle,
}: React.PropsWithChildren<{ pageTitle?: string }>) {
  return (
    <>
      <Head>
        <title>{pageTitle ? `${pageTitle} | Tramona` : "Tramona"}</title>
      </Head>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">{children}</main>
      </div>
      <Footer />
    </>
  );
}

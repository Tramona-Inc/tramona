import Head from "next/head";
import MainLayout from "@/components/_common/Layout/MainLayout";

export default function Page() {
  return (
    <MainLayout>
      <div className="[&>*]:flex [&>*]:min-h-[calc(100vh-4.25rem)] [&>*]:flex-col [&>*]:items-center [&>*]:justify-center [&>*]:gap-8 [&>*]:px-4 [&>*]:py-16 [&>*]:sm:px-16">
        <Head>
          <title>About | Tramona</title>
        </Head>
      </div>
    </MainLayout>
  );
}

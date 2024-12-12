import MainLayout from "@/components/_common/Layout/MainLayout";
import DemoVideos from "@/components/demo/DemoVideos";
import Head from "next/head";

export default function DemoPage() {
  return (
    <MainLayout>
      <Head>
        <title>Demo | Tramona</title>
      </Head>
      <DemoVideos />
    </MainLayout>
  );
}

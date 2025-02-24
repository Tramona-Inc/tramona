import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import TravelerPage from "@/components/landing-page/TravelerPage";
import MastHead from "@/components/landing-page/_sections/MastHead";
import { getFeed } from "@/server/api/routers/feedRouter";
import { type InferGetStaticPropsType } from "next";

export async function getStaticProps() {
  const requestFeed = await getFeed({ maxNumEntries: 10 }).then((r) =>
    r.filter((r) => r.type === "request"),
  );
  return {
    props: { requestFeed },
    revalidate: 60 * 5, // 5 minutes
  };
}

export default function Home({
  requestFeed,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <DashboardLayout>
      <MastHead requestFeed={requestFeed} />
      <TravelerPage requestFeed={requestFeed} />
    </DashboardLayout>
  );
}

import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import TravelerPage from "@/components/landing-page/TravelerPage";
import { db } from "@/server/db";
import { properties } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export async function getStaticProps() {
  // ironic naming
  const staticProperties = await db.query.properties.findMany({
    columns: {
      id: true,
      imageUrls: true,
      name: true,
      maxNumGuests: true,
      numBathrooms: true,
      numBedrooms: true,
      numBeds: true,
      originalNightlyPrice: true,
    },
    where: eq(properties.isPrivate, false),
    limit: 15,
  });

  return {
    props: { staticProperties },
  };
}

export type StaticProperty = Awaited<
  ReturnType<typeof getStaticProps>
>["props"]["staticProperties"][number];

export default function Home({
  staticProperties,
}: {
  staticProperties: StaticProperty[];
}) {
  return (
    <DashboardLayout type={"guest"}>
      <TravelerPage staticProperties={staticProperties} />
    </DashboardLayout>
  );
}

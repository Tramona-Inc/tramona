import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import TravelerPage from "@/components/landing-page/TravelerPage";
import { db } from "@/server/db";
import { bookedDates, properties } from "@/server/db/schema";
import { and, eq, lte, sql } from "drizzle-orm";

export async function getStaticProps() {
  const lpProperties = await db
    .select({
      id: properties.id,
      imageUrls: properties.imageUrls,
      name: properties.name,
      maxNumGuests: properties.maxNumGuests,
      numBathrooms: properties.numBathrooms,
      numBedrooms: properties.numBedrooms,
      numBeds: properties.numBeds,
      originalNightlyPrice: properties.originalNightlyPrice,
      vacancyCount: sql<number>`(
          select count(${bookedDates.propertyId})
          from ${bookedDates}
          where 
            ${bookedDates.propertyId} = ${properties.id}
            and ${bookedDates.date} >= CURRENT_DATE
            and ${bookedDates.date} <= CURRENT_DATE + INTERVAL '30 days'
        )`.as("vacancyCount"),
    })
    .from(properties)
    .where((t) =>
      and(
        eq(properties.isPrivate, false),
        lte(t.vacancyCount, 10),
        lte(properties.originalNightlyPrice, 20000),
      ),
    )
    .limit(15);

  return {
    props: { staticProperties: lpProperties },
    revalidate: 60 * 60 * 24,
  };
}

export type LpProperty = Awaited<
  ReturnType<typeof getStaticProps>
>["props"]["staticProperties"][number];

export default function Home({
  staticProperties,
}: {
  staticProperties: LpProperty[];
}) {
  return (
    <DashboardLayout type={"guest"}>
      <TravelerPage staticProperties={staticProperties} />
    </DashboardLayout>
  );
}

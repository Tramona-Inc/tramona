import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import Spinner from "@/components/_common/Spinner";
import PropertyPage from "@/components/property/PropertyPage";
import { api, type RouterOutputs } from "@/utils/api";
import Head from "next/head";
import { useRouter } from "next/router";

import { type GetServerSideProps } from "next";
import { NextSeo } from "next-seo";
import { db } from "@/server/db";
import { properties } from "@/server/db/schema/tables/properties";
import { and, eq } from "drizzle-orm";
import { requests } from "@/server/db/schema";

export type PropertyWithDetails = RouterOutputs["properties"]["getById"];

type PageProps = {
  serverPropertyId: string;
  serverPropertyName: string;
  serverFirstImage: string;
  baseUrl: string;
};

export default function Property({
  serverPropertyName,
  serverFirstImage,
  serverPropertyId,
  baseUrl,
}: PageProps) {
  const router = useRouter();
  const propertyId = parseInt(router.query.id as string);

  const { data: property } = api.properties.getById.useQuery(
    { id: propertyId },
    {
      enabled: router.isReady,
    },
  );

  const metaTitle = serverPropertyName
    ? serverPropertyName
    : "Check out this property on Tramona.";

  const metaDescription = "Check out this property! | Tramona";
  return (
    <>
      <NextSeo
        title={metaTitle}
        description={metaDescription}
        canonical={`${baseUrl}/property/${serverPropertyId}`}
        openGraph={{
          url: `${baseUrl}/property/${serverPropertyId}`,
          type: "website",
          title: metaTitle,
          description: metaDescription,
          images: [
            {
              url: serverFirstImage,
              width: 900,
              height: 800,
              alt: "Property Image",
              type: "image/jpeg",
            },
          ],
          site_name: "Tramona",
        }}
      />
      <DashboardLayout type="guest">
        <div className="px-4 pb-64 pt-6">
          <div className="mx-auto max-w-5xl">
            {property ? <PropertyPage property={property} /> : <Spinner />}
          </div>
        </div>
      </DashboardLayout>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const serverPropertyId = parseInt(context.query.id as string);

  const isProduction = process.env.NODE_ENV === "production";
  const baseUrl = isProduction
    ? "https://www.tramona.com"
    : "https://6fb1-104-32-193-204.ngrok-free.app"; //change to your live dev server

  const propertyInfo = await db
    .select({
      name: properties.name,
      images: properties.imageUrls,
    })
    .from(properties)
    .where(
      and(
        eq(properties.propertyStatus, "Listed"),
        eq(properties.id, serverPropertyId),
      ),
    );

  return {
    props: {
      serverPropertyId: serverPropertyId.toString(),
      serverPropertyName: propertyInfo[0]!.name ?? "",
      serverFirstImage: propertyInfo[0]!.images[0] ?? "",
      baseUrl: baseUrl,
    },
  };
};

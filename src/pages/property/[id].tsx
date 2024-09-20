import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import Spinner from "@/components/_common/Spinner";
import { api, type RouterOutputs } from "@/utils/api";
import { useRouter } from "next/router";
import { type GetServerSideProps } from "next";
import { NextSeo } from "next-seo";
import { db } from "@/server/db";
import { properties } from "@/server/db/schema/tables/properties";
import { eq } from "drizzle-orm";
import PropertyPage from "@/components/offers/PropertyPage";

export type PropertyWithDetails = RouterOutputs["properties"]["getById"];

type PageProps = {
  serverPropertyId: string;
  serverPropertyName: string;
  serverFirstImage: string;
  baseUrl: string;
};

export default function Page({
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
      <DashboardLayout>
        <div className="px-4 pt-6">
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
    .select({ name: properties.name, images: properties.imageUrls })
    .from(properties)
    .where(eq(properties.id, serverPropertyId))
    .then((res) => res[0]!);

  return {
    props: {
      serverPropertyId: serverPropertyId.toString(),
      serverPropertyName: propertyInfo.name,
      serverFirstImage: propertyInfo.images[0]!,
      baseUrl: baseUrl,
    },
  };
};

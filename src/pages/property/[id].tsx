// TODO: remove eslint check later
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck

import React from "react";
import { useRouter } from "next/router";
import { api } from "@/utils/api";

export default function Page() {
  const router = useRouter();

  const propertyId = parseInt(router.query.id as string);

  const { data: property } = api.properties.getById.useQuery({
    id: propertyId,
  });

  return property ? (
    <div>
      <h1>{property.hostName}</h1>
      <p>{property.name}</p>
    </div>
  ) : (
    <h1>Property doesn&apos;t exist</h1>
  );
}

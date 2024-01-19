import React from "react";
import { useRouter } from "next/router";

export default function Page() {
  const router = useRouter();
  return <p>Property ID: {router.query.id}</p>;
}

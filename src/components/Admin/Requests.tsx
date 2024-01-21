import { api } from "@/utils/api";
import React from "react";
import RequestCard from "./RequestCard";

export default function DisplayRequests() {
  const { data: requests } = api.requests.getAll.useQuery();

  return (
    <section className="flex flex-col gap-5 md:grid-cols-2 lg:grid">
      {requests?.map((request) => (
        <RequestCard key={request.id} request={request} />
      ))}
    </section>
  );
}

import { api } from "@/utils/api";
import React from "react";
import RequestCard from "./RequestCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function DisplayRequests() {
  const { data: requests } = api.requests.getAll.useQuery();

  return (
    <section className="flex flex-col gap-5 md:grid md:grid-cols-2">
      {requests?.map((request) => (
        <RequestCard key={request.id} request={request} />
      ))}
    </section>
  );
}

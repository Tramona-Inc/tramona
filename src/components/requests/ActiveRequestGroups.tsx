import RequestEmptySvg from "@/components/_common/EmptyStateSvg/RequestEmptySvg";
import Spinner from "@/components/_common/Spinner";
import { RequestCards } from "@/components/requests/RequestCards";
import { api } from "@/utils/api";
import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";

type EmptyStateProps = {
  children?: React.ReactNode;
  title: string;
  description: string;
  redirectTitle: string;
  href: string;
};

function EmptyStateValue(props: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-4 pt-32">
      {props.children}

      <h2 className="text-center font-bold">{props.title}</h2>
      <p className="text-center font-medium">{props.description}</p>
      <Button className="px-8 font-bold" asChild>
        <Link href={props.href}>{props.redirectTitle}</Link>
      </Button>
    </div>
  );
}

export default function ActiveRequestGroups() {
  const { data: requests } = api.requests.getMyRequests.useQuery();

  if (!requests) return <Spinner />;

  return requests.activeRequestGroups.length !== 0 ? (
    <RequestCards requestGroups={requests.activeRequestGroups} />
  ) : (
    <EmptyStateValue
      title={"You have no city requests"}
      description={
        "You don&apos;t have any active requests. Requests that you submit will show up here."
      }
      redirectTitle={"Request Deal"}
      href={"/"}
    >
      <RequestEmptySvg />
    </EmptyStateValue>
  );
}

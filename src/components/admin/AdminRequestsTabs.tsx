import { api } from "@/utils/api";
import Link from "next/link";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";

const navs = [
  {
    title: "Incoming Requests",
    description: "View all incoming requests from user",
    href: "/admin/incoming-requests",
  },
  {
    title: "Past Requests",
    description: "View completd requests thate user has booked",
    href: "/admin/past-requests",
  },
  {
    title: "Utility",
    description: "Additional utility functions for admin privelages only",
    href: "/admin/utility",
  },
];

export default function AdminRequestsTabs() {
  const { data: requests } = api.requests.getAll.useQuery();

  return (
    <div className="grid grid-cols-2 gap-5">
      {navs.map((nav, index) => {
        return (
          <Card key="index">
            <Link href={nav.href}>
              <CardHeader>
                <CardTitle>{nav.title}</CardTitle>
                <CardDescription>{nav.description}</CardDescription>
              </CardHeader>
            </Link>
          </Card>
        );
      })}
    </div>
  );
}

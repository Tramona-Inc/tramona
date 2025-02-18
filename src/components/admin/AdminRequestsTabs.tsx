import Link from "next/link";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Description } from "@radix-ui/react-dialog";

const navs = [
  {
    title: "Incoming Requests",
    description: "View all incoming requests from user",
    href: "/admin/incoming-requests",
  },
  {
    title: "Past Requests",
    description: "View completed requests that user has booked",
    href: "/admin/past-requests",
  },
  {
    title: "Utility",
    description: "Additional utility functions for admin privileges only",
    href: "/admin/utility",
  },
  {
    title: "Admin Property Upload",
    description: "Backdoor form to upload properties for hosts",
    href: "/admin/property-upload",
  },
  {
    title: "Admin Superhog Verification",
    description: "Manually verify Superhog status for users",
    href: "/admin/superhog",
  },
  {
    title: "Add Additional Charge for Past Trips",
    description: "Charge travelers for damages or other expenses post-trip",
    href: "/admin/additional-charge",
  },
  {
    title: "See all Reports",
    description: "See user and host reports for misconduct or property damamge",
    href: "/admin/reports",
  },
  {
    title: "Unclaimed Offers Scrapers",
    description: "Trigger the scraping for unclaimed offers page",
    href: "/admin/scrapers",
  },
  {
    title: "Feed",
    description: "See all the latest hosts who just signed up",
    href: "/admin/feed",
  },
  {
    title: "Requests to Book",
    description: "See all requests to book",
    href: "/admin/requests",
  }
];

export default function AdminRequestsTabs() {
  return (
    <div className="grid grid-cols-2 gap-5">
      {navs.map((nav, index) => {
        return (
          <Card key={index}>
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

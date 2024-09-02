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

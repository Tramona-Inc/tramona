import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import Link from "next/link";

function TravelerBillingTab({
  title,
  description,
  href,
  onClick,
}: {
  title: string;
  description: string;
  href: string;
  onClick: () => void;
}) {
  return (
    <Link href={href} onClick={onClick}>
      <Card>
        <CardHeader className="text-xl font-bold">{title}</CardHeader>
        <CardContent className="mt-2">{description}</CardContent>
      </Card>
    </Link>
  );
}

export default TravelerBillingTab;

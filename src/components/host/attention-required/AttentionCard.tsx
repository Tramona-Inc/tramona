"use client";

import { AlertCircle } from "lucide-react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import Link from "next/link";

interface AttentionCardProps {
  // Icon props
  icon?: React.FC<{ className?: string }>;
  iconClassName?: string;
  href: string;
  // Content props
  title: string;
  description?: string;
  subtitle?: string;

  // Style props
  className?: string;
}

export default function AttentionCard({
  icon: Icon = AlertCircle,
  iconClassName = "size-5",
  href = "",
  title = "",
  description,
  subtitle,

  // Style defaults
  className = "",
}: AttentionCardProps) {
  return (
    <Link href={href}>
      <Card className={`h-full w-full`}>
        <CardContent className={` ${className}`}>
          <div className="flex flex-col gap-3">
            {/* Icon */}
            <Icon className={iconClassName} />

            {/* Content */}
            <div className="space-y-2">
              <CardTitle className="text-base font-semibold">{title}</CardTitle>
              {description && (
                <p className="text-base text-muted-foreground">{description}</p>
              )}
              {subtitle && <p className="text-sm">{subtitle}</p>}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

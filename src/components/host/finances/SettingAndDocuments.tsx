import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

interface SettingItem {
  title: string;
  href: string;
  component?: React.ReactNode;
}

interface SettingsAndDocumentsProps {
  items: SettingItem[];
}

export default function SettingsAndDocuments({
  items,
}: SettingsAndDocumentsProps) {
  return (
    <Card className="mx-auto w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          Settings and documents
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {items.map((item, index) => (
            <li key={index}>
              <Link
                href={item.href}
                className="flex w-full items-center justify-between rounded-md px-4 py-2 transition-colors hover:bg-gray-100"
              >
                <span>{item.title}</span>
                {item.component ? (
                  item.component
                ) : (
                  <ChevronRight className="h-5 w-5" />
                )}
              </Link>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, ChevronUpIcon } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

export default function SubDropdown({
  title,
  menuItems,
}: {
  title: string;
  menuItems: { href: string; title: string }[];
}) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const setOpenChange = () => {
    setIsOpen(!isOpen);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setOpenChange}>
      <DropdownMenuTrigger className="flex items-center gap-x-2">
        <p className="text-xs font-bold text-primaryGreen hover:text-foreground xl:text-sm">
          {title}
        </p>
        {isOpen ? <ChevronUpIcon size={15} /> : <ChevronDown size={15} />}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 text-primaryGreen">
        {menuItems.map((item, index) => (
          <Link href={item.href} key={index}>
            <DropdownMenuItem>{item.title}</DropdownMenuItem>
          </Link>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

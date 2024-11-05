import React from "react";
import { Button } from "../ui/button";
import { useRouter } from "next/router";
import { ArrowLeftIcon } from "lucide-react";

function BackButton({ href }: { href: string }) {
  const router = useRouter();
  return (
    <Button
      size="sm"
      variant="ghost"
      onClick={() => router.push(href)}
      className="ml-3 mt-4 self-start"
    >
      <ArrowLeftIcon size={20} />
      Back
    </Button>
  );
}

export default BackButton;

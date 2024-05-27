import { Button } from "@/components/ui/button";
import Link from "next/link";

export function SupportBtn() {
  return (
    <>
      <div className="sm:hidden">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/help-center">24/7 Support</Link>
        </Button>
      </div>
      <div className="hidden sm:block">
        <Button variant="ghost" asChild>
          <Link href="/help-center">24/7 Support</Link>
        </Button>
      </div>
    </>
  );
}

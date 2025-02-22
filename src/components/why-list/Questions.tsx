import Link from "next/link";
import { Button } from "@/components/ui/button";

export const Questions = () => {
  return (
    <ul className="mx-12 mb-12 flex flex-wrap justify-center gap-24">
      <div className="flex flex-col items-center">
        <Link
          href="https://calendly.com/tramona"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button size="lg" className="bg-primaryGreen text-white">
            Book a Call
          </Button>
        </Link>
      </div>
    </ul>
  );
};
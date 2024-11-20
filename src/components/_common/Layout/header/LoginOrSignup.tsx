import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function LogInSignUp({
  isMobile = false,
}: {
  isMobile?: boolean;
}) {
  return (
    <>
      <Button
        asChild
        variant={isMobile ? "darkOutline" : "secondary"}
        className={`${isMobile ? "darkOutline px-2" : "secondary"} text-primaryGreen`}
        onClick={() => console.log("hg")}
      >
        <Link href="/auth/signin">Sign In</Link>
      </Button>
      {!isMobile && (
        <Button asChild>
          <Link href="/auth/signup">Sign Up</Link>
        </Button>
      )}
    </>
  );
}

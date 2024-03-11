import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import Link from "next/link";
import AvatarDropdown from "./AvatarDropdown";

function LogInBtn() {
  return (
    <Button asChild variant="darkOutline">
      <Link href="/auth/signin">Log in</Link>
    </Button>
  );
}

function SignUpBtn() {
  return (
    <Button asChild className="rounded-full" variant="darkPrimary">
      <Link href="/auth/signup">Sign up</Link>
    </Button>
  );
}

export default function HeaderTopRight() {
  const { data: session, status } = useSession();

  return (
    <>
      {(status === "loading" || status === "unauthenticated") && <LogInBtn />}
      {status === "authenticated" && <AvatarDropdown session={session} />}
    </>
  );
}

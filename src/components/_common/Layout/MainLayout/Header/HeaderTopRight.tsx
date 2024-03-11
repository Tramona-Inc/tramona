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

  switch (status) {
    case "loading":
      return <LogInBtn />;
    case "unauthenticated":
      return (
        <div className="flex gap-2">
          <LogInBtn />
        </div>
      );
    case "authenticated":
      return <AvatarDropdown session={session} />;
  }
}

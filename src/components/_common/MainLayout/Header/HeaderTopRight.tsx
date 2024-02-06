import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "../../../ui/button";
import AvatarDropdown from "./AvatarDropdown";

function LogInBtn() {
  return (
    <Button
      className="rounded-full"
      variant="darkOutline"
      onClick={() => signIn()}
    >
      Log in
    </Button>
  );
}

function SignUpBtn() {
  return (
    <Button
      className="rounded-full"
      variant="darkPrimary"
    >
      <Link href={"/auth/signup"}>Sign up</Link>
    </Button>
  );
}

export default function HeaderTopRight() {
  const { data: session, status } = useSession();

  switch (status) {
    case "loading":
      return <div className="h-10" />;
    case "unauthenticated":
      return (
        <div className="flex gap-2">
          <LogInBtn />
          <SignUpBtn />
        </div>
      );
    case "authenticated":
      return <AvatarDropdown session={session} />;
  }
}

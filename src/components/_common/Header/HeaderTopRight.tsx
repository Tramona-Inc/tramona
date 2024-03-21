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

export default function HeaderTopRight() {
  const { data: session, status } = useSession();

  return (
    <>{status === "authenticated" && <AvatarDropdown session={session} />}</>
  );
}

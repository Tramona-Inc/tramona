import { useSession } from "next-auth/react";
import AvatarDropdown from "./AvatarDropdown";

export default function HeaderTopRight() {
  const { data: session, status } = useSession();

  return status === "authenticated" && <AvatarDropdown session={session} />;
}

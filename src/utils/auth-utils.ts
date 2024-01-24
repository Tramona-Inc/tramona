import { type User } from "@/server/db/schema";
import { signIn, useSession } from "next-auth/react";

export function useRequireRole(allowedRoles: User["role"][]) {
  const session = useSession({ required: true });
  if (
    session.status === "authenticated" &&
    !allowedRoles.includes(session.data.user.role)
  ) {
    void signIn();
  }

  return session;
}

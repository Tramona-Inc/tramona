import { type User } from "@/server/db/schema";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

export function useRequireRole(allowedRoles: User["role"][]) {
  const session = useSession({ required: true });

  useEffect(() => {
    if (
      session.status === "authenticated" &&
      !allowedRoles.includes(session.data.user.role)
    ) {
      void signIn();
    }
  }, [allowedRoles, session?.data?.user.role, session.status]);

  return session;
}

export function useRequireNoAuth() {
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session.status === "authenticated") {
      void router.push("/requests");
    }
  }, [router, session.status]);
}

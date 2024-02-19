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

/**
 * if you are already signed in, you will be redirected
 * to /requests if youre a guest, /admin if youre an admin,
 * and the hosts page later when we do that
 */
export function useRequireNoAuth() {
  const session = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session.status === "authenticated") {
      void router.replace(
        session.data.user.role === "admin" ? "/admin" : "/requests",
      );
    }
  }, [router, session.data?.user.role, session.status]);
}

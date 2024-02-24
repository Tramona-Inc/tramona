import { api } from "@/utils/api";
import { useRouter } from "next/router";
import { useEffect, useMemo } from "react";

export default function VerifyEmail() {
  const router = useRouter();

  const id = router.query.id as string;
  const token = router.query.token as string;

  const date = useMemo(() => new Date(), []); // useMemo from React

  const mutation = api.auth.verifyEmailToken.useMutation({
    onSuccess: () => {
      void router.push({
        pathname: "/auth/signin",
        query: { isNewUser: true, isVerified: true },
      });
    },
  });

  useEffect(() => {
    if (id && token) {
      mutation.mutate({ id: id, token: token, date: date });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, token]);

  return (
    <main className="flex h-screen flex-col items-center justify-center">
      {mutation.isLoading && (
        <p className="text-muted-foreground">Verifying your email...</p>
      )}
      {mutation.error && (
        <p className="text-muted-foreground">
          Something went wrong, please try signing up again
        </p>
      )}
    </main>
  );
}

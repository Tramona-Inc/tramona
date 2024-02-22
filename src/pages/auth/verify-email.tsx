import { api } from "@/utils/api";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";

export default function VerifyEmail() {
  const router = useRouter();

  const id = router.query.id as string;
  const token = router.query.token as string;

  const date = useMemo(() => new Date(), []); // useMemo from React

  const [error, setError] = useState("");

  const { mutateAsync, isLoading } = api.auth.verifyEmailToken.useMutation({
    onSuccess: () => {
      void router.push({
        pathname: "/auth/signin",
        query: { isNewUser: true, isVerified: true },
      });
    },
    onError: (error) => {
      setError(error.message);
      return null;
    },
  });

  useEffect(() => {
    if (id && token) {
      void mutateAsync({ id: id, token: token, date: date });
    }
  }, [date, id, mutateAsync, token]);

  return (
    <main className="flex h-screen flex-col items-center justify-center">
      {isLoading && <h1>Verifying your email ...</h1>}
      {error && (
        <div>
          <h1>{error}</h1>
          <p>Please sign up</p>
        </div>
      )}
    </main>
  );
}

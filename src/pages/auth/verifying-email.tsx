import { api } from "@/utils/api";
import { useRouter } from "next/router";
import { useEffect, useMemo } from "react";

export default function VerifyEmail() {
  const router = useRouter();

  const id = router.query.id as string;
  const token = router.query.token as string;
  const conversationId = router.query.conversationId as string;
  const userId = router.query.userId as string;

  const date = useMemo(() => new Date(), []); // useMemo from React

  const { mutateAsync: addUserToConversation } =
    api.messages.addUserToConversation.useMutation();

  const {
    mutate: verifyEmailToken,
    isLoading,
    error,
  } = api.auth.verifyEmailToken.useMutation({
    onSuccess: () => {
      if (conversationId && userId) {
        void addUserToConversation({ userId, conversationId });
      }

      void router.push({
        pathname: "/auth/verify-email-success",
      });
    },
  });

  useEffect(() => {
    if (id && token) {
      verifyEmailToken({ id: id, token: token, date: date });
    }
  }, [date, id, token, verifyEmailToken]);

  return (
    <div className="flex h-screen-minus-header flex-col items-center justify-center">
      {isLoading && (
        <p className="text-muted-foreground">Verifying your email...</p>
      )}
      {error && (
        <p className="text-muted-foreground">
          Something went wrong, please try signing up again
        </p>
      )}
    </div>
  );
}

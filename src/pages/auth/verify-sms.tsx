import { OTPInput } from "@/components/ui/otp-input";
import { api } from "@/utils/api";
import { errorToast } from "@/utils/toasts";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Page() {
  const [code, setCode] = useState("");

  const router = useRouter();

  const { phone, email } = router.query;

  const { mutateAsync } = api.twilio.verifyOTP.useMutation({
    onSuccess: () => {
      void router.push({
        pathname: "/auth/verify-sms",
        query: {
          email: email,
        },
      });
    },
    onError: () => {
      setCode("");
      errorToast("Wrong code");
    },
  });

  useEffect(() => {
    if (code.length === 6 && phone) {
      // Verify Code
      void mutateAsync({ to: phone as string, code: code });
    }
  }, [code]);

  return (
    <div className="flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center gap-4">
      <h1 className="text-center text-5xl font-bold tracking-tight">
        Please verify your phone number
      </h1>
      <p className="text-muted-foreground">Check in your messages</p>

      <OTPInput
        value={code}
        onPaste={(e) => {
          e.preventDefault();
        }}
        placeholder=""
        type="number"
        onChange={(value) => setCode(value)}
      />
    </div>
  );
}

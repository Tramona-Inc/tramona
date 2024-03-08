import { OTPInput } from "@/components/ui/otp-input";
import { api } from "@/utils/api";
import { errorToast } from "@/utils/toasts";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Page() {
  const [code, setCode] = useState("");

  const router = useRouter();

  const { phone, email } = router.query;

  const { mutateAsync: mutateVerifyOTP } = api.twilio.verifyOTP.useMutation();
  const { mutateAsync: mutateInsertPhone } =
    api.users.insertPhoneWithEmail.useMutation();

  useEffect(() => {
    const verifyCode = async () => {
      if (code.length === 6 && phone) {
        // Verify Code
        const verifyOTPResponse = await mutateVerifyOTP({
          to: phone as string,
          code: code,
        });

        const { status } = verifyOTPResponse; // pending | approved | canceled

        if (status !== "approved") {
          errorToast("Incorrect code!");
          return;
        } else {
          // insert email
          if (email && phone) {
            void mutateInsertPhone({
              email: email as string,
              phone: phone as string,
            });
          }

          void router.push({
            pathname: "/auth/verify-email",
            query: {
              email: email,
            },
          });
        }
      }
    };

    void verifyCode(); // Call the asynchronous function here
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

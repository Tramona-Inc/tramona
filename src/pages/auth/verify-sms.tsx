import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { api } from "@/utils/api";
import { errorToast } from "@/utils/toasts";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import MainLayout from "@/components/_common/Layout/MainLayout";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";

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
    <MainLayout>
      <div className="flex min-h-screen-minus-header flex-col items-center justify-center gap-4">
        <h1 className="text-center text-5xl font-bold tracking-tight">
          Please verify your phone number
        </h1>
        <p className="text-muted-foreground">Check your messages for code</p>

        <InputOTP
          maxLength={6}
          pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
          value={code}
          onChange={(value) => setCode(value)}
          render={({ slots }) => (
            <InputOTPGroup>
              {slots.map((slot, index) => (
                <InputOTPSlot key={index} {...slot} />
              ))}{" "}
            </InputOTPGroup>
          )}
        />
      </div>
    </MainLayout>
  );
}

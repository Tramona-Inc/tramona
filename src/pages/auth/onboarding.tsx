import MainLayout from "@/components/_common/Layout/MainLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { PhoneInput } from "@/components/ui/input-phone";
import { api } from "@/utils/api";
import { errorToast } from "@/utils/toasts";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Onboarding() {
  const [phone, setPhone] = useState<string>("");
  const [sent, setSent] = useState<boolean>(false);
  const [code, setCode] = useState("");

  const { data: session } = useSession();

  const router = useRouter();

  const { mutateAsync: mutateSendOTP } = api.twilio.sendOTP.useMutation({
    onSuccess: () => {
      setSent(true);
    },
  });

  const { mutateAsync: mutateVerifyOTP } = api.twilio.verifyOTP.useMutation();
  const { mutateAsync: mutateInsertPhone } =
    api.users.insertPhoneWithUserId.useMutation();

  useEffect(() => {
    const verifyCode = async () => {
      if (code.length === 6 && phone) {
        // Verify Code
        const verifyOTPResponse = await mutateVerifyOTP({
          to: phone,
          code: code,
        });

        const { status } = verifyOTPResponse; // pending | approved | canceled

        if (status !== "approved") {
          errorToast("Incorrect code!");
          return;
        } else {
          // insert phone with email
          if (session?.user.id) {
            void mutateInsertPhone({
              userId: session.user.id,
              phone: phone,
            });

            void router.push({
              pathname: "/auth/welcome",
            });
          }
        }
      }
    };

    void verifyCode(); // Call the asynchronous function here
  }, [code]);

  return (
    <MainLayout
      type="auth"
      className="container flex flex-col items-center justify-center"
    >
      <h1 className="text-center text-4xl font-bold">
        First, let&apos;s setup your account!
      </h1>
      <Card className="my-5 flex min-w-[400px] flex-col gap-5">
        <CardHeader>
          <CardDescription className="text-2xl">
            Verify a mobile phone number
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          {sent ? (
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
          ) : (
            <PhoneInput
              defaultCountry={"US"}
              onChange={(value) => setPhone(value)}
            />
          )}
        </CardContent>
        <CardFooter>
          {sent ? (
            <>
              <p className="text-center text-xs text-muted-foreground">
                Not seeing the code?{" "}
                <span
                  className="cursor-pointer underline hover:text-black"
                  onClick={() => mutateSendOTP({ to: phone })}
                >
                  Try again
                </span>
              </p>
            </>
          ) : (
            <>
              <Button
                className="w-full"
                onClick={() => mutateSendOTP({ to: phone })}
              >
                Send Verification Code
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                We verify a phone number on account creation to ensure account
                security. SMS & data charges may apply.
              </p>
            </>
          )}
        </CardFooter>
      </Card>
    </MainLayout>
  );
}

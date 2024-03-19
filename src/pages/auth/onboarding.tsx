import MainLayout from "@/components/_common/Layout/MainLayout";
import { Icons } from "@/components/_icons/icons";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { PhoneInput } from "@/components/ui/input-phone";
import { toast } from "@/components/ui/use-toast";
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
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { data: session } = useSession();

  const router = useRouter();

  const { mutateAsync: mutateSendOTP } = api.twilio.sendOTP.useMutation({
    onSuccess: () => {
      toast({
        title: "Code sent!",
        description: "Please check your text messages.",
      });
      setSent(true);
    },
  });

  const { mutateAsync: mutateVerifyOTP } = api.twilio.verifyOTP.useMutation();
  const { mutateAsync: mutateInsertPhone } =
    api.users.insertPhoneWithUserId.useMutation();

  const { update } = useSession();

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

            toast({
              title: "Successfully verified phone!",
              description: "Your phone has been added to your account.",
            });

            void update();

            void router.push({
              pathname: "/auth/welcome",
            });
          }
        }
      }
    };

    void verifyCode(); // Call the asynchronous function here
  }, [code]);

  const handlePhoneInputKeyDown = (event: { key: string }) => {
    if (event.key === "Enter" && !sent) {
      setIsLoading(true);
      void mutateSendOTP({ to: phone });
    }
  };

  function handleOnSubmit() {
    setIsLoading(true);
    void mutateSendOTP({ to: phone });
  }

  return (
    <MainLayout
      type="auth"
      className="container flex flex-col items-center justify-center gap-5"
    >
      <h1 className="text-center text-4xl font-bold tracking-tight">
        Let&apos;s set up your account
      </h1>
      <Card className=" min-w-[400px]">
        <CardHeader>
          <CardTitle>Verify your phone number</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center pt-8">
          {sent ? (
            <InputOTP
              maxLength={6}
              pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
              value={code}
              autoFocus
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
              autoFocus
              defaultCountry={"US"}
              onChange={(value) => setPhone(value)}
              onKeyDown={handlePhoneInputKeyDown}
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
              <Button onClick={() => handleOnSubmit()} disabled={isLoading}>
                {isLoading && (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                )}
                Send Verification Code
              </Button>

              <p className="text-center text-xs text-muted-foreground">
                We verify your phone number on account creation to ensure
                account security. SMS & data charges may apply.
              </p>
            </>
          )}
        </CardFooter>
      </Card>
    </MainLayout>
  );
}

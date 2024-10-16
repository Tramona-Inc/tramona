import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import MainLayout from "@/components/_common/Layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { PhoneInput } from "@/components/ui/input-phone";
import { toast } from "@/components/ui/use-toast";
import { api } from "@/utils/api";
import { errorToast } from "@/utils/toasts";
import { zodResolver } from "@hookform/resolvers/zod";
import { OTPInput, REGEXP_ONLY_DIGITS } from "input-otp";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { type Country, isValidPhoneNumber } from "react-phone-number-input";
import { z } from "zod";
import { zodString } from "@/utils/zod-utils";
import { cn, useUpdateUser } from "@/utils/utils";
import { ButtonSpinner } from "@/components/ui/button-spinner";
// feel free to refactor this lol

export default function Onboarding() {
  const formSchema = z.object({
    phoneNumber: zodString().refine(isValidPhoneNumber, {
      message: "Invalid phone number",
    }),
  });

  const [country, setCountry] = useState<Country | undefined>("US");

  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { phoneNumber: "" },
  });

  const { data: session } = useSession();
  const [sent, setSent] = useState<boolean>(false);
  const router = useRouter();
  const [code, setCode] = useState("");
  const [codeLoading, setCodeLoading] = useState(false);
  const inputOtpRef = useRef<React.ElementRef<typeof OTPInput>>(null);

  const { phoneNumber } = form.watch();

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
  const { mutateAsync: phoneNumberIsTaken } =
    api.users.phoneNumberIsTaken.useMutation();

  const { refetch: refetchVerifications } =
    api.users.getMyVerifications.useQuery(undefined, { enabled: false });

  const { updateUser } = useUpdateUser();

  async function onPhoneSubmit({ phoneNumber }: FormValues) {
    if (!country) {
      form.setError("phoneNumber", { message: "Invalid phone number" });
      return;
    }

    if (!session?.user.id) {
      errorToast(
        "Please login to continue, or try again if you're logged in already",
      );
      return;
    }

    if (country !== "US") await updateUser({ isWhatsApp: true });

    const phoneNumberTaken = await phoneNumberIsTaken({ phoneNumber });
    if (phoneNumberTaken) {
      form.setError("phoneNumber", {
        message: "Phone number already in use, please try again",
      });
      return;
    }
    await mutateSendOTP({ phoneNumber });
  }

  useEffect(() => {
    if (code.length < 6 || !phoneNumber || !session?.user.id) return;

    setCodeLoading(true);

    void mutateVerifyOTP({ phoneNumber, code })
      .then(async ({ status }) => {
        if (status !== "approved") {
          setCode("");
        }

        if (status === "wrong code") {
          errorToast("Incorrect code, please try again");
          return;
        }

        if (status === "code expired" || status === "already used") {
          toast({
            title:
              status === "code expired" ? "Code expired" : "Code already used",
            description: "Please try again with a new one",
            duration: Infinity,
            action: (
              <Button
                variant="white"
                onClick={() => mutateSendOTP({ phoneNumber })}
              >
                Send code
              </Button>
            ),
          });
          return;
        }

        await updateUser({ onboardingStep: 1, phoneNumber });
        void refetchVerifications();

        toast({
          title: "Successfully verified phone!",
          description: "Your phone has been added to your account.",
        });

        void router.push({
          pathname: "/auth/onboarding-1",
        });
      })
      .finally(() => setCodeLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code, phoneNumber, session?.user.id]);

  return (
    <MainLayout className="flex flex-col justify-center gap-5 p-4">
      <h1 className="text-center text-4xl font-bold tracking-tight">
        Verify your phone number
      </h1>
      <div>
        <Card className="mx-auto max-w-md">
          <CardContent>
            {sent ? (
              <InputOTP
                ref={inputOtpRef}
                maxLength={6}
                pattern={REGEXP_ONLY_DIGITS}
                value={code}
                autoFocus
                onChange={(value) => setCode(value)}
                className={cn("mx-auto w-max", codeLoading && "opacity-50")}
                render={({ slots }) => (
                  <InputOTPGroup>
                    {slots.map((slot, index) => (
                      <InputOTPSlot key={index} {...slot} />
                    ))}
                  </InputOTPGroup>
                )}
              />
            ) : (
              <Form {...form}>
                <form
                  className="flex flex-col gap-2"
                  onSubmit={form.handleSubmit(onPhoneSubmit)}
                >
                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <PhoneInput
                            placeholder="Enter phone number"
                            defaultCountry="US"
                            onCountryChange={setCountry}
                            autoFocus
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit">
                    <ButtonSpinner />
                    Send Verification Code
                  </Button>
                </form>
              </Form>
            )}
          </CardContent>
          {sent ? (
            <>
              <p className="text-center text-xs text-muted-foreground">
                Not seeing the code?{" "}
                <span
                  className="cursor-pointer underline hover:text-black"
                  onClick={() => mutateSendOTP({ phoneNumber })}
                >
                  Try again
                </span>
              </p>
            </>
          ) : (
            <p className="text-center text-xs text-muted-foreground">
              We verify your phone number on account creation to ensure account
              security. SMS & data charges may apply.
            </p>
          )}
        </Card>
      </div>
    </MainLayout>
  );
}

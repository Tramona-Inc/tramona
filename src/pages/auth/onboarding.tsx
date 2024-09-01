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
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { type Country, isValidPhoneNumber } from "react-phone-number-input";
import { z } from "zod";
import { zodString } from "@/utils/zod-utils";
import { Icons } from "@/components/_icons/icons";
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
  const { mutateAsync: mutateInsertPhone } =
    api.users.insertPhoneWithUserId.useMutation();

  const { refetch: refetchVerifications } =
    api.users.getMyVerifications.useQuery(undefined, { enabled: false });
  const { mutateAsync: updateProfile } = api.users.updateProfile.useMutation({
    onSuccess: () => {
      void refetchVerifications();
    },
  });

  const { update } = useSession();

  async function onPhoneSubmit({ phoneNumber }: FormValues) {
    if (!country) {
      form.setError("phoneNumber", { message: "Invalid phone number" });
      return;
    }
    // i feel like i remember this being mentioned in a meeting but idk
    // so uncomment it out if you want

    // if (country !== "US") {
    //   form.setError("phoneNumber", {
    //     message: "We only accept US phone numbers for now",
    //   });
    //   return;
    // }
    if (country !== "US") {
      if (session?.user.id) {
        await updateProfile({
          id: session.user.id,
          isWhatsApp: true,
        });
      }
    }

    if (await phoneNumberIsTaken({ phoneNumber })) {
      form.setError("phoneNumber", {
        message: "Phone number already in use, please try again",
      });
      return;
    }
    await mutateSendOTP({ to: phoneNumber });
  }

  useEffect(() => {
    const verifyCode = async () => {
      if (code.length === 6 && phoneNumber) {
        // Verify Code
        const verifyOTPResponse = await mutateVerifyOTP({
          to: phoneNumber,
          code: code,
        });

        const { status } = verifyOTPResponse; // pending | approved | canceled

        if (status !== "approved") {
          errorToast("Incorrect code, please try again");
          return;
        } else {
          // insert phone with email
          if (session?.user.id) {
            void mutateInsertPhone({
              userId: session.user.id,
              phone: phoneNumber,
            });
            await updateProfile({
              id: session.user.id,
              onboardingStep: 1,
            });

            toast({
              title: "Successfully verified phone!",
              description: "Your phone has been added to your account.",
            });

            void update();

            void router.push({
              pathname: "/auth/onboarding-1",
            });
          }
        }
      }
    };

    void verifyCode(); // Call the asynchronous function here
  }, [code]);

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
                maxLength={6}
                pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                value={code}
                autoFocus
                onChange={(value) => setCode(value)}
                className="mx-auto w-max"
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
                  <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting && (
                      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    )}
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
                  onClick={() => mutateSendOTP({ to: phoneNumber })}
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

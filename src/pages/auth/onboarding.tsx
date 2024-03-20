import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { isValidPhoneNumber } from "react-phone-number-input";
import { z } from "zod";
import { zodString } from "@/utils/zod-utils";

export default function Onboarding() {
  const formSchema = z.object({
    phone: zodString().refine(isValidPhoneNumber, {
      message: "Invalid phone number",
    }),
  });

  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { phone: "" },
    reValidateMode: "onSubmit",
  });

  const { data: session } = useSession();
  const [sent, setSent] = useState<boolean>(false);
  const router = useRouter();
  const [code, setCode] = useState("");
  const { phone } = form.watch();

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

  async function onPhoneSubmit({ phone }: FormValues) {
    // form.setError("phone", { message: phone });
    await mutateSendOTP({ to: phone });
  }

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

  return (
    <MainLayout
      type="auth"
      className="container flex flex-col items-center justify-center gap-5"
    >
      <h1 className="text-center text-4xl font-bold tracking-tight">
        Let&apos;s set up your account
      </h1>
      <Card className="my-5 flex max-w-[400px] flex-col gap-5">
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
            <Form {...form}>
              <form
                className="flex flex-col gap-2"
                onSubmit={form.handleSubmit(onPhoneSubmit)}
              >
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <PhoneInput
                          placeholder="Enter phone number"
                          defaultCountry="US"
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
            <p className="text-center text-xs text-muted-foreground">
              We verify your phone number on account creation to ensure account
              security. SMS & data charges may apply.
            </p>
          )}
        </CardFooter>
      </Card>
    </MainLayout>
  );
}

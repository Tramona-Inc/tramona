import { type Dispatch, type SetStateAction, useEffect, useState } from "react";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";

import TramonaIcon from "../_icons/TramonaIcon";
import { Button } from "../ui/button";
import { useToast } from "../ui/use-toast";

import { api } from "@/utils/api";
import { errorToast } from "@/utils/toasts";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import { useSession } from "next-auth/react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";

interface OTPDialogProps {
  toPhoneNumber: string;
  setVerified: Dispatch<SetStateAction<boolean>>;
  setPhoneNumber?: Dispatch<SetStateAction<string>> | undefined;
}

export default function OTPDialog({
  toPhoneNumber,
  setVerified,
  setPhoneNumber,
}: OTPDialogProps) {
  const { toast } = useToast();

  const { data, update } = useSession();

  const [code, setCode] = useState<string>("");

  const [open, setOpen] = useState<boolean>(false);

  const sendOTPMutation = api.twilio.sendOTP.useMutation();

  const verifyOTPMutation = api.twilio.verifyOTP.useMutation();

  const sendVerificationCode = async () => {
    try {
      await sendOTPMutation.mutateAsync({
        to: toPhoneNumber,
      });

      toast({
        title: "Verification code sent!",
        description: "Code is valid for 10 minutes.",
      });
    } catch (err) {
      setOpen(false);
      setVerified(false);
      errorToast();
    }
  };

  const { mutate } = api.users.updatePhoneNumber.useMutation({
    onSuccess: (res) => {
      setCode("");
      toast({
        title: "Phone number verified!",
      });
      void update((prev: typeof data) => ({ ...prev, user: res }));
      if (res[0]?.phoneNumber) {
        setPhoneNumber?.(res[0]?.phoneNumber);
      }
    },
    onError: () => {
      errorToast("Error verifying phone number!");
    },
  });

  useEffect(() => {
    const verify = async () => {
      if (code.length === 6 && toPhoneNumber) {
        try {
          const verifyOTPResponse = await verifyOTPMutation.mutateAsync({
            to: toPhoneNumber,
            code: code,
          });

          const { status } = verifyOTPResponse; // pending | approved | canceled

          if (status !== "approved") {
            toast({
              variant: "destructive",
              title: "Incorrect code!",
              description: "Try re-entering verification code.",
            });

            return;
          } else {
            mutate({ phoneNumber: toPhoneNumber });
          }

          //add phoneNumber to database
          setVerified(true);
          setOpen(false);
        } catch (err) {
          setVerified(false);

          setOpen(false);
          if (err instanceof Error) {
            errorToast();
          }
        }
      }
    };

    void verify();
  }, [code]);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <Button
        variant="link"
        onClick={() => {
          if (toPhoneNumber !== "") {
            setOpen(true);
            void sendVerificationCode();
          } else {
            toast({
              variant: "destructive",
              title: "Please enter a phone number!",
            });
          }
        }}
      >
        Send verification code
      </Button>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="justify-content mb-5 flex flex-col items-center gap-2">
            <TramonaIcon />
            Enter OTP code
          </AlertDialogTitle>

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
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
}

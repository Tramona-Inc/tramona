import {
  type Dispatch,
  type SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";

import TramonaIcon from "../_icons/TramonaIcon";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useToast } from "../ui/use-toast";

import { api } from "@/utils/api";
import { errorToast } from "@/utils/toasts";
import { useSession } from "next-auth/react";

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

  const initialCode = ["", "", "", "", "", ""];

  const [code, setCode] = useState<Array<string>>(initialCode);

  const [otpSent, setOtpSent] = useState<boolean>(false);

  const [open, setOpen] = useState<boolean>(false);

  const refs = useRef<Array<HTMLInputElement | null>>([]);

  const allFilled = useMemo(() => code.every((value) => value !== ""), [code]);

  const sendOTPMutation = api.twilio.sendOTP.useMutation();

  const verifyOTPMutation = api.twilio.verifyOTP.useMutation();

  const handleInputChange = (index: number, value: string) => {
    // Focus the next input field when a digit is entered into the current input field
    setCode((prevCode) => {
      const newCode = [...prevCode];
      newCode[index] = value;

      // If the value is not empty and there's a next input field, focus on it
      if (value && index < code.length - 1 && refs.current[index + 1]) {
        refs.current[index + 1]?.focus();
      }

      return newCode;
    });
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace" && index > 0 && code[index] === "") {
      // Clear current input and move focus to previous input
      setCode((prevCode) => {
        const newCode = [...prevCode];
        newCode[index - 1] = "";
        refs.current[index - 1]?.focus();
        return newCode;
      });
    }
  };

  const reset = () => {
    setCode(initialCode);
    setOtpSent(false);
    setVerified(false);
    refs.current[0]?.focus();
  };

  const clear = () => {
    setCode(initialCode);
    refs.current[0]?.focus();
  };

  const sendVerificationCode = async () => {
    reset();

    try {
      await sendOTPMutation.mutateAsync({
        to: toPhoneNumber,
      });

      setOtpSent(true);
      setOpen(true);

      toast({
        title: "Verification code sent!",
        description: "Code is valid for 10 minutes.",
      });
    } catch (err) {
      console.log('askdlfjaskdf');
      setOpen(false);
      setVerified(false);
      errorToast();
    }
  };

    const { mutate } = api.users.updatePhoneNumber.useMutation(
      {onSuccess: (res) => {
      toast({
        title: "Phone number verified!"
      });
      void update((prev: typeof data) => ({ ...prev, user: res }));
      if (res[0]?.phoneNumber) {
        setPhoneNumber?.(res[0]?.phoneNumber);
      }
    }, onError: () => {
      errorToast("Error verifying phone number!");
    }});


  useEffect(() => {
    const verify = async () => {
      try {
        const verifyOTPResponse = await verifyOTPMutation.mutateAsync({
          to: toPhoneNumber,
          code: code.join(""),
        });

        const { status } = verifyOTPResponse; // pending | approved | canceled

        if (status !== "approved") {
          toast({
            variant: "destructive",
            title: "Incorrect code!",
            description: "Try re-entering verification code.",
          });

          clear();
          return;
        } else {
          console.log('yay');
          mutate({phoneNumber: toPhoneNumber});
        }

        //add phoneNumber to database
        console.log('?');
        setVerified(true);
        setOpen(false);
      } catch (err) {
        setVerified(false);
        console.log(".");
        setOpen(false);
        if (err instanceof Error) {
          errorToast(err.message);
        }
      }
    };

    if (otpSent && allFilled) {
      console.log('voided');
      void verify();
    }
  }, [allFilled]);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <Button
        variant="link"
        onClick={() => {
          if (toPhoneNumber !== "") {
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

          <div className="flex flex-row gap-6">
            {code.map((_, idx) => (
              <Input
                className="h-[55px] text-center text-lg"
                key={idx}
                type="text"
                value={code[idx]}
                maxLength={1}
                onChange={(e) => {
                  handleInputChange(idx, e.target.value);
                }}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                ref={(input) => (refs.current[idx] = input)}
              />
            ))}
          </div>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
}

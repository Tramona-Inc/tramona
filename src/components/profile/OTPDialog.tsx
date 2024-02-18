import {
  useEffect,
  useRef,
  useState,
  useMemo,
  Dispatch,
  SetStateAction,
} from "react";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useToast } from "../ui/use-toast";
import TramonaIcon from "../_icons/TramonaIcon";

import { api } from "@/utils/api";

interface OTPDialogProps {
  toPhoneNumber: string;
  setVerified: Dispatch<SetStateAction<boolean>>;
}

export default function OTPDialog({
  toPhoneNumber,
  setVerified,
}: OTPDialogProps) {
  const { toast } = useToast();

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

      toast({
        title: "Verification code sent!",
        description: "Code is valid for 10 minutes.",
      });

      setOtpSent(true);
      setOpen(true);
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Something went wrong!",
        description: err,
      });
    }
  };

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
        }

        toast({
          title: "Phone number successfully verified!",
        });

        setVerified(true);
        setOpen(false);
      } catch (err: any) {
        toast({
          variant: "destructive",
          title: "Something went wrong!",
          description: err,
        });
      }
    };

    if (otpSent && allFilled) {
      verify();
    }
  }, [allFilled]);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="link" onClick={sendVerificationCode}>
          Send verification code
        </Button>
      </AlertDialogTrigger>
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

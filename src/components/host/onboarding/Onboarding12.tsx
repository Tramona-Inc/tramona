import React, { useState, KeyboardEvent } from "react";
import RequestFeed from "@/components/activity-feed/RequestFeed";
import { type FeedRequestItem } from "@/components/activity-feed/ActivityFeed";
import { Button } from "@/components/ui/button";
import OnboardingFooter from "./OnboardingFooter";

import { Input } from "@/components/ui/input";
import { LinkIcon, MailsIcon, PlusIcon, X } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { z } from "zod";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/utils/api";

type Props = {
  requestFeed: FeedRequestItem[];
};

const Onboarding12: React.FC<Props> = ({ requestFeed }) => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [emailList, setEmailList] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [emailListError, setEmailListError] = useState<string | null>(null);

  const sendEmailMutation =
    api.emails.sendListOfHostReferralEmails.useMutation();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) setError(null);
  };

  const emailSchema = z.string().email({ message: "Must be a valid email" });

  const addEmail = () => {
    const result = emailSchema.safeParse(email);
    if (result.error && result.error.errors[0]) {
      setError(result.error.errors[0].message);
      return;
    }
    const lowerEmail = email.trim().toLowerCase();
    const alreadyExist = emailList.some(
      (existingEmail) => lowerEmail === existingEmail.trim().toLowerCase(),
    );
    if (alreadyExist) {
      setError("This email is already added");
    } else {
      setEmailListError(null);
      setEmailList([...emailList, email]);
      setEmail("");
      setError(null);
    }
  };
  const removeEmail = (emailToRemove: string) => {
    setEmailList(emailList.filter((e) => e !== emailToRemove));
    toast({
      title: "Removed email",
    });
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addEmail();
    }
  };

  const handleShareLink = async () => {
    try {
      await navigator.clipboard.writeText(
        "https://www.tramona.com/auth/signup",
      );
      toast({
        title: "Link Copied",
        description: "The signup link has been copied to your clipboard",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy the link",
      });
    }
  };

  const sendEmails = async () => {
    console.log(emailList);
    if (emailList.length < 1) {
      setEmailListError("Must add an email first");
      return;
    }

    await sendEmailMutation.mutateAsync(
      { emailList: emailList },
      {
        onSuccess: () => {
          toast({
            title: "Congratulations!",
            description: "Emails successfully sent",
            duration: 1500,
          });
          setEmailList([]);
        },
      },
    );
  };

  return (
    <>
      <div className="mx-auto mt-24 flex min-h-screen flex-col md:mt-0 md:flex-row">
        <div className="hidden md:flex md:w-1/2 md:items-center md:justify-center md:overflow-y-auto md:p-6">
          <div className="h-[850px] rounded-lg border px-2 py-2 shadow-xl">
            <RequestFeed requestFeed={requestFeed} />
          </div>
        </div>

        <div className="hidden md:flex md:items-center">
          <div className="h-5/6 w-px bg-black"></div>
        </div>

        <div className="flex flex-col items-start justify-center p-4 md:w-1/2 md:p-6 md:px-16">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Know other hosts?
          </h2>
          <p className="mb-6 text-xl md:text-3xl">
            Every day, hundreds of requests go to waste. Invite them now to fill
            their calendar
          </p>
          <Card className="mx-auto w-full">
            <CardHeader>
              <CardTitle>Add Emails</CardTitle>
            </CardHeader>
            <CardContent className="w-full space-y-4">
              {emailList.length > 0 && (
                <div className="mb-4 rounded-md border">
                  <ul className="space-y-2">
                    {emailList.map((email, index) => (
                      <li
                        key={index}
                        className="flex items-center justify-between rounded-md p-2 font-semibold"
                      >
                        <span className="text-sm">{email}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeEmail(email)}
                          className="h-8 w-8"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="flex w-full space-x-2">
                <div className="flex w-full flex-col gap-y-1">
                  <Input
                    type="email"
                    placeholder="Enter email address"
                    value={email}
                    onChange={handleEmailChange}
                    onKeyDown={handleKeyDown}
                    className="w-full flex-grow"
                  />
                  {error && (
                    <p className="mx-2 text-xs tracking-tight text-red-600">
                      {error}
                    </p>
                  )}
                </div>
                <Button onClick={addEmail} variant="outline" className="w-1/3">
                  Add
                  <PlusIcon size={18} />
                </Button>
              </div>
              <p className="mt-4 text-sm text-gray-600">
                Earn a feeless booking for each friend that&apos;s added
              </p>
            </CardContent>
          </Card>
          <div className="mx-auto my-4 flex w-full gap-x-6 px-1">
            <Button
              className="w-full"
              variant="secondary"
              onClick={handleShareLink}
            >
              Copy Link
              <LinkIcon size={18} />
            </Button>
            <Button
              className="w-full"
              onClick={async () => {
                await sendEmails();
              }}
            >
              {!sendEmailMutation.isLoading ? (
                <div className="flex flex-row items-center gap-x-4">
                  Send Emails <MailsIcon size={18} />{" "}
                </div>
              ) : (
                <div className="flex h-full items-center justify-center space-x-2">
                  <span className="mx-2 text-white">Sending Emails</span>
                  <div className="h-1 w-1 animate-bounce rounded-full bg-white [animation-delay:-0.3s]"></div>
                  <div className="h-1 w-1 animate-bounce rounded-full bg-white [animation-delay:-0.15s]"></div>
                  <div className="h-1 w-1 animate-bounce rounded-full bg-white"></div>
                </div>
              )}
            </Button>
          </div>
          {emailListError && (
            <p className="mx-2 text-center text-sm text-red-600">
              {emailListError}
            </p>
          )}
        </div>
      </div>
      <OnboardingFooter isForm={false} />
    </>
  );
};

export default Onboarding12;

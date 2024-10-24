import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, MinusIcon, LinkIcon, MailIcon, ShareIcon } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { api } from "@/utils/api";
import { errorToast } from "@/utils/toasts";
import { ButtonSpinner } from "@/components/ui/button-spinner";

interface RequestEmailInvitationProps {
  madeByGroupId: number;
  inviteLink: string | null;
}

const RequestEmailInvitation = ({
  madeByGroupId, // keeping this here for proper email sending
  inviteLink,
}: RequestEmailInvitationProps) => {
  const [emails, setEmails] = useState<string[]>([""]);
  const [isEmailFormVisible, setIsEmailFormVisible] = useState(false);

  const inviteUserByEmail = api.groups.inviteUserByEmail.useMutation();

  const handleEmailChange = (index: number, value: string) => {
    const newEmails = [...emails];
    newEmails[index] = value;
    setEmails(newEmails);
  };

  const addEmailField = () => {
    if (emails.length < 3) {
      setEmails([...emails, ""]);
    }
  };

  const removeEmailField = (index: number) => {
    if (index !== 0) {
      const newEmails = emails.filter((_, i) => i !== index);
      setEmails(newEmails);
    }
  };

  const handleCopyToClipboard = () => {
    if (inviteLink) {
      navigator.clipboard
        .writeText(inviteLink)
        .then(() => toast({ title: "Link copied to clipboard!" }))
        .catch((err) => console.error("Failed to copy: ", err));
    }
  };

  const handleInvite = async () => {
    await Promise.all(
      emails
        .filter(Boolean)
        .map((email) =>
          inviteUserByEmail.mutateAsync({ email, groupId: madeByGroupId }),
        ),
    )
      .then(() => {
        toast({ title: "Invites sent successfully!" });
      })
      .catch(() => errorToast("Error sending invites, please try again"));
  };

  return (
    <div>
      <div className="hidden md:block">
        <div className="space-y-2">
          {emails.map((email, index) => (
            <div key={index} className="relative">
              <Input
                type="email"
                value={email}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  handleEmailChange(index, event.target.value)
                }
                placeholder={`johndoe@gmail.com`}
                className={`w-full ${index !== 0 ? "pr-16" : ""}`}
              />
              {index !== 0 && (
                <button
                  type="button"
                  onClick={() => removeEmailField(index)}
                  className="absolute right-2 top-3 items-center text-sm text-red-500 hover:text-red-700"
                >
                  <MinusIcon className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
          {emails.length < 3 && (
            <Button variant="secondary" onClick={addEmailField}>
              <Plus size={20} />
              Add another email
            </Button>
          )}
        </div>
        {inviteLink && (
          <button
            className="m-0 mt-2 flex flex-row items-center p-0 text-sm text-blue-500"
            onClick={handleCopyToClipboard}
          >
            <LinkIcon className="mr-2 h-4 w-4" />
            Copy invite link
          </button>
        )}
        <Button onClick={handleInvite} className="mt-2 w-full">
          <ButtonSpinner />
          Send
        </Button>
      </div>
      <div className="block md:hidden">
        <div className="space-y-2 p-2">
          {inviteLink && (
            <Button
              onClick={async () => {
                try {
                  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                  if (navigator.share) {
                    await navigator.share({
                      title:
                        "Tramona is a platform that connects travelers with hosts to create unique deals for short-term stays. Check it out!",
                      url: inviteLink,
                    });
                    toast({ title: "Link shared successfully!" });
                  } else {
                    await navigator.clipboard.writeText(inviteLink);
                    toast({ title: "Link copied to clipboard!" });
                  }
                } catch (error: unknown) {
                  const errorMessage =
                    error instanceof Error ? error.message : "Unknown error";
                  toast({
                    title: "Error sharing link",
                    description: errorMessage,
                  });
                }
              }}
              className="flex w-full items-center justify-center bg-[#004236] hover:bg-[#004236]"
            >
              <ShareIcon color="white" className="mr-2" />
              Share a link
            </Button>
          )}
          <div className="inline-flex w-full items-center justify-center">
            <hr className="my-8 h-px w-64 border-0 bg-gray-200 dark:bg-gray-700" />
            <span className="absolute left-1/2 -translate-x-1/2 bg-background px-3 font-medium text-gray-900">
              or
            </span>
          </div>
          <Button
            variant="secondary"
            onClick={() => setIsEmailFormVisible(!isEmailFormVisible)}
            className="flex w-full items-center justify-center"
          >
            <MailIcon className="mr-2" />
            Add by email
          </Button>

          {isEmailFormVisible && (
            <div className="space-y-2">
              {emails.map((email, index) => (
                <div key={index} className="relative">
                  <Input
                    type="email"
                    value={email}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                      handleEmailChange(index, event.target.value)
                    }
                    placeholder={`johndoe@gmail.com`}
                    className={`w-full ${index !== 0 ? "pr-16" : ""}`}
                  />

                  {index !== 0 && (
                    <button
                      type="button"
                      onClick={() => removeEmailField(index)}
                      className="absolute right-2 top-3 items-center text-sm text-red-500 hover:text-red-700"
                    >
                      <MinusIcon className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
              {emails.length < 3 && (
                <Button variant="secondary" onClick={addEmailField}>
                  <Plus size={20} />
                  Add another email
                </Button>
              )}
              <Button onClick={handleInvite} className="mt-2 w-full">
                <ButtonSpinner />
                Send
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RequestEmailInvitation;

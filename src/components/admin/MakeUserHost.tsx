import { api } from "@/utils/api";
import { useEffect, useState } from "react";
import CopyToClipboardBtn from "../_utils/CopyToClipboardBtn";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";

export default function MakeUserHost() {
  const [conversationId, setConversationId] = useState<string>();
  const [url, setUrl] = useState<string>();

  const { mutate } = api.hosts.createUrlToBeHost.useMutation({
    onSuccess: (url: string) => {
      setUrl(url);
    },
  });

  function handleUrl() {
    mutate({ conversationId: conversationId! });
  }

  useEffect(() => {
    function updateUrl() {
      if (!conversationId) {
        setUrl("");
      }
    }

    updateUrl();
  }, [url, conversationId]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Make user a host</CardTitle>
        <CardDescription>
          Generates a url for user to be host on sign up and add to conversation
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col space-y-5">
        <h1 className="font-bold">Conversation ID:</h1>
        <Input
          placeholder={"Id"}
          onChange={(e) => setConversationId(e.target.value)}
          value={conversationId}
          className="w-full"
        />

        <h1 className="font-bold">
          Click <span className="bg-white">Generate URL:</span>
        </h1>
        <Input
          placeholder={"Press the generate url button"}
          value={url}
          disabled={!url}
          className="w-full"
        />
        {url ? (
          <CopyToClipboardBtn
            message={url}
            render={({ justCopied, copyMessage }) => (
              <Button
                size="lg"
                variant={"darkOutline"}
                className=""
                onClick={copyMessage}
              >
                {justCopied ? "Copied!" : "Copy link"}
              </Button>
            )}
          />
        ) : (
          <Button
            size="lg"
            onClick={() => handleUrl()}
            disabled={!conversationId}
          >
            Generate URL
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

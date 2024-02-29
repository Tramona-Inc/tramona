import { api } from "@/utils/api";
import { SetStateAction, useState } from "react";
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

export default function AdminUtility() {
  const [url, setUrl] = useState<string>();

  const { mutate } = api.users.createUrlToBeAHost.useMutation({
    onSuccess: (url: SetStateAction<string | undefined>) => {
      setUrl(url);
    },
  });

  function handleUrl() {
    mutate();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Make user a host</CardTitle>
        <CardDescription>
          Generates a url for user to be host on sign up
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col space-y-5">
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
          <Button size="lg" onClick={() => handleUrl()}>
            Generate URL
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

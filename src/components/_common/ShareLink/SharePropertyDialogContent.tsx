import {
  WhatsappShareButton,
  EmailShareButton,
  WhatsappIcon,
  EmailIcon,
} from "react-share";
import { MessageCircleIcon } from "lucide-react";
import { Button } from "../../ui/button";
import CopyToClipboardBtn from "@/components/_utils/CopyToClipboardBtn";
import { Input } from "@/components/ui/input";

const SharePropertyDialogContent = ({
  id,
  propertyName,
}: {
  id: number;
  propertyName: string;
}) => {
  const shareUrl = `https://tramona.com/property/${id}`;
  const title = propertyName;
  const description = "Check this property out";

  return (
    <div>
      <h2 className="text-xl font-semibold">
        <p>Share Property Link</p>
      </h2>
      <div className="flex gap-2 pt-4">
        <div className="flex-1">
          <Input type="text" value={shareUrl} readOnly />
        </div>
        <CopyToClipboardBtn
          message={shareUrl}
          render={({ justCopied, copyMessage }) => (
            <Button className="w-24" variant="secondary" onClick={copyMessage}>
              {justCopied ? "Copied!" : "Copy"}
            </Button>
          )}
        />
      </div>
      <div className="flex gap-4 pt-2 text-white">
        <WhatsappShareButton url={shareUrl} title={title}>
          <WhatsappIcon size={32} round />
        </WhatsappShareButton>
        <EmailShareButton url={shareUrl} subject={title} body={description}>
          <EmailIcon size={32} round />
        </EmailShareButton>
        <a
          href={`sms:&body=${shareUrl}`}
          className="items-center rounded-full bg-green-500 p-2 "
        >
          <MessageCircleIcon size={18} />
        </a>
        {/* You can add more share buttons here */}
      </div>
    </div>
  );
};

export default SharePropertyDialogContent;

import { useState } from "react";
import {
  WhatsappShareButton,
  EmailShareButton,
  WhatsappIcon,
  EmailIcon,
} from "react-share";
import { CopyIcon, MessageCircleIcon } from "lucide-react";
import { Button } from "../../ui/button";

const ShareDialogContent = ({
  id,
  isRequest,
  linkImage,
  propertyName,
}: {
  id: number;
  isRequest: boolean;
  linkImage: string;
  propertyName: string;
}) => {
  const shareUrl = isRequest
    ? `https://tramona.com/request/${id}`
    : `https://tramona.com/public-offer/${id}`;
  const title = propertyName;
  const description = isRequest
    ? "Check my properties offers out"
    : "Check this property out";

  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const link = `https://tramona.com/public-offer/${id}`;
    navigator.clipboard.writeText(link).then(
      () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Reset the copied state after 2 seconds
      },
      (err) => {
        console.error("Failed to copy: ", err);
      },
    );
  };

  return (
    <div className="text-xl font-semibold">
      <div className=" flex flex-col justify-around gap-y-3 text-xl">
        {isRequest ? <h1>Share all Offers Link</h1> : <h1>Share Offer Link</h1>}
        <div className=" flex appearance-none flex-row items-center justify-between gap-x-2 text-base font-normal">
          <input
            type="text"
            value={
              isRequest
                ? `https://tramona.com/request/${id}`
                : `https://tramona.com/public-offer/${id}`
            }
            readOnly
            className="w-full appearance-none rounded-xl border px-5 py-2"
          />
          <Button size="icon" variant="outlineMinimal" onClick={handleCopy}>
            {" "}
            <CopyIcon />{" "}
          </Button>
        </div>
        {copied && (
          <span className="ml-2 text-center text-base text-green-700">
            Link copied!
          </span>
        )}
      </div>
      <div className="mt-4 flex space-x-4">
        <WhatsappShareButton url={shareUrl} title={title}>
          <WhatsappIcon size={32} round />
        </WhatsappShareButton>
        <EmailShareButton url={shareUrl} subject={title} body={description}>
          <EmailIcon size={32} round />
        </EmailShareButton>
        <a
          href={`sms:&body=${encodeURIComponent(`${title} - ${description} - ${shareUrl} - ${linkImage}`)}`}
          className="items-center rounded-full bg-green-500 px-2 py-2  text-white"
        >
          <MessageCircleIcon size={18} />
        </a>
        {/* You can add more share buttons here */}
      </div>
    </div>
  );
};

export default ShareDialogContent;

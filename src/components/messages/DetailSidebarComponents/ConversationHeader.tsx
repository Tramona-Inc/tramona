import React from "react";
import { type Conversation } from "@/utils/store/conversations";
import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";
import { useRouter } from "next/router";
import { generateBookingUrl } from "@/utils/utils";
import Link from "next/link";

interface ConversationHeaderProps {
  conversation: Conversation;
  propertyName: string | undefined;
  propertyId: number | undefined;
}
const ConversationHeader: React.FC<ConversationHeaderProps> = ({
  conversation,
  propertyName,
  propertyId,
}) => {
  const conversationUrl = propertyId ? generateBookingUrl(propertyId) : null;

  const router = useRouter();

  const handleHideDetails = () => {
    void router.push(
      {
        pathname: router.pathname,
        query: {
          ...router.query,
          details: "false",
        },
      },
      undefined, // This is required to keep the current URL
      { shallow: true }, // Op
    );
  };

  return (
    <div className="mx-auto flex h-20 flex-row items-center justify-around gap-x-3 border-b bg-white text-center">
      {conversationUrl ? (
        <Link href={conversationUrl}>
          <h2 className="mx-1 truncate text-lg font-semibold text-gray-800 xl:text-xl 2xl:text-2xl">
            {propertyName ?? "Property Information"}
          </h2>
        </Link>
      ) : (
        <h2 className="mx-1 truncate text-lg font-semibold text-gray-800 xl:text-xl 2xl:text-2xl">
          {propertyName ?? "Property Information"}
        </h2>
      )}
      <Button
        size="icon"
        onClick={handleHideDetails}
        variant="ghost"
        className="mx-1 rounded-full"
      >
        {" "}
        <XIcon />{" "}
      </Button>
    </div>
  );
};

export default ConversationHeader;

import React from "react";
import { type Conversation } from "@/utils/store/conversations";
import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";
import { useRouter } from "next/router";

interface HostConversationHeaderProps {
  conversation: Conversation;
  propertyName: string | undefined;
}
const HostConversationHeader: React.FC<HostConversationHeaderProps> = ({
  conversation,
  propertyName,
}) => {
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
    <div className="mx-auto flex h-20 w-full items-center justify-around border-b bg-white text-center">
      <h2 className="text-2xl font-bold text-gray-800">
        {propertyName ?? "Property Information"}
      </h2>
      <Button
        size="icon"
        onClick={handleHideDetails}
        variant="ghost"
        className="rounded-full"
      >
        {" "}
        <XIcon />{" "}
      </Button>
    </div>
  );
};

export default HostConversationHeader;

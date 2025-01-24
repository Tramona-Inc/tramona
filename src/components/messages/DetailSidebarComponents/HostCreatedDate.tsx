import React from "react";
import { type Conversation } from "@/utils/store/conversations";
import { format } from "date-fns";

interface HostCreatedDateProps {
  conversation: Conversation;
}

const HostCreatedDate: React.FC<HostCreatedDateProps> = ({ conversation }) => {
  return (
    <div className="rounded-lg border bg-gray-50 p-4">
      <p className="text-sm text-gray-700">
        <span className="font-semibold">Created At:</span>{" "}
        {format(new Date(conversation.createdAt), "MMMM dd, yyyy h:mm a")}
      </p>
    </div>
  );
};

export default HostCreatedDate;

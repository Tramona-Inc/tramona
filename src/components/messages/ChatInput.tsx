import { useConversation } from "@/utils/store/conversations";
import { type ChatMessageType, useMessage } from "@/utils/store/messages";
import supabase from "@/utils/supabase-client";
import { errorToast } from "@/utils/toasts";
import { zodResolver } from "@hookform/resolvers/zod";
import { nanoid } from "nanoid";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { Input } from "../ui/input";

import { api } from "@/utils/api";
import { sub } from "date-fns";
import { ArrowUp } from "lucide-react";
import { Button } from "../ui/button";
import { useUpdateUser } from "@/utils/utils";

const formSchema = z.object({
  message: z.string().refine((data) => data.trim() !== ""),
});

export default function ChatInput({
  conversationId,
}: {
  conversationId: string;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });

  const { data: session } = useSession();

  const addMessageToConversation = useMessage(
    (state) => state.addMessageToConversation,
  );

  const setOptimisticIds = useMessage((state) => state.setOptimisticIds);

  const setConversationToTop = useConversation(
    (state) => state.setConversationToTop,
  );

  const removeMessageFromConversation = useMessage(
    (state) => state.removeMessageFromConversation,
  );

  const { updateUser } = useUpdateUser();
  const { mutateAsync: sendSMS } = api.twilio.sendSMS.useMutation();
  const { mutateAsync: sendSlackToAdmin } =
    api.messages.sendAdminSlackMessage.useMutation();
  const { data: participantPhoneNumbers } =
    api.messages.getParticipantsPhoneNumbers.useQuery({ conversationId });

  const twilioWhatsAppMutation = api.twilio.sendWhatsApp.useMutation();

  const { data: _conversationExists } =
    api.messages.getConversations.useQuery();

  const conversationList = useConversation((state) => state.conversationList);

  // Add check before sending message
  if (!conversationId) {
    console.error("No conversation ID available");
    return;
  }

  // Validate conversation ID format if using nanoid
  if (conversationId.length !== 21) {
    console.error("Invalid conversation ID format");
    return;
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (session) {
      console.log("1. Starting message submission...");
      console.log("Current conversation ID:", conversationId);
      console.log("Available conversations:", conversationList);
      console.log("Fetching conversation from DB with ID:", conversationId);

      // First verify the conversation exists in Supabase
      const { data: dbConversation, error: checkError } = await supabase
        .from("conversations")
        .select("id, created_at, name")
        .eq("id", conversationId)
        .single();

      console.log("2. Database check result:", {
        conversation: dbConversation,
        error: checkError,
      });

      if (checkError ?? !dbConversation) {
        console.error("3. Conversation not found in database:", checkError);
        errorToast("Conversation not found. Please refresh the page.");
        return;
      }

      const newMessage: ChatMessageType = {
        id: nanoid(),
        createdAt: new Date().toISOString(),
        conversationId: conversationId,
        userId: session.user.id,
        message: values.message,
        read: false,
        isEdit: false,
      };

      console.log("4. Created new message object:", newMessage);

      // Add message optimistically
      addMessageToConversation(conversationId, newMessage);
      setOptimisticIds(newMessage.id);
      setConversationToTop(conversationId, {
        id: newMessage.id,
        conversationId: conversationId,
        userId: session.user.id,
        message: newMessage.message,
        createdAt: new Date().toISOString(),
        read: false,
        isEdit: false,
      });
      form.reset();

      console.log("5. Attempting Supabase message insert...");

      // Insert message into database
      const messageData = {
        id: newMessage.id,
        conversation_id: conversationId,
        user_id: newMessage.userId,
        message: newMessage.message,
        read: false,
        is_edit: false,
        created_at: new Date().toISOString(),
      };

      console.log("6. Message data to insert:", messageData);

      const { error } = await supabase.from("messages").insert(messageData);

      if (error) {
        console.error("7. Supabase insert error:", {
          error,
          messageData,
          conversationId,
        });
        removeMessageFromConversation(conversationId, newMessage.id);
        errorToast();
        return;
      }

      console.log("8. Message successfully inserted");

      // Send Slack notification
      await sendSlackToAdmin({
        message: newMessage.message,
        conversationId,
        senderId: newMessage.userId,
      });

      // Only send SMS/WhatsApp if there are unread messages and enough time has passed
      if (participantPhoneNumbers) {
        const unreadParticipants = participantPhoneNumbers.filter(
          ({ lastTextAt }) =>
            !lastTextAt || lastTextAt <= sub(new Date(), { hours: 1 }),
        );

        if (unreadParticipants.length > 0) {
          void Promise.all(
            unreadParticipants.map(async ({ phoneNumber, isWhatsApp }) => {
              if (phoneNumber) {
                if (isWhatsApp) {
                  await twilioWhatsAppMutation.mutateAsync({
                    templateId: "HXae95c5b28aa2f5448a5d63ee454ccb74",
                    to: phoneNumber,
                  });
                } else {
                  await sendSMS({
                    to: phoneNumber,
                    msg: "You have a new unread message in Tramona, visit Tramona.com to view",
                  });
                }
                await updateUser({ lastTextAt: new Date() });
              }
            }),
          );
        }
      }
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="p-2 pt-0">
        <div className="flex items-center overflow-clip rounded-full border-2">
          <div className="flex-1">
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Type a message"
                      className="border-none"
                      autoFocus
                      {...field}
                    />
                  </FormControl>
                  {/* <FormMessage /> */}
                </FormItem>
              )}
            />
          </div>
          <div className="pr-2">
            <Button size="icon" type="submit" className="h-7 w-7 rounded-full">
              <ArrowUp size={20} />
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}

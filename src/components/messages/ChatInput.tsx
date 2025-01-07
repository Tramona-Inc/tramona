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
  const { mutateAsync: checkMessageModeration } = api.llama.checkMessage.useMutation();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (session) {
      const messageId = nanoid();

      // checks if message is appropriate before sending
      const moderationResult = await checkMessageModeration({
        message: values.message,
        conversationId,
        messageId: messageId,
      });

      if (!moderationResult.result.isAppropriate && moderationResult.result.confidence >= 0.8) {
        errorToast("Message flagged for inappropriate content, and was not sent");
        return; // Don't send message if flagged
      }

      const newMessage: ChatMessageType = {
        id: messageId,
        createdAt: new Date().toISOString(),
        conversationId: conversationId,
        userId: session.user.id,
        message: values.message,
        read: false,
        isEdit: false,
      };

      const newMessageToDb = {
        id: newMessage.id,
        created_at: new Date().toISOString(),
        conversation_id: conversationId,
        user_id: newMessage.userId,
        message: newMessage.message,
        read: newMessage.read,
        is_edit: newMessage.isEdit,
      };

      setConversationToTop(conversationId, newMessage);
      addMessageToConversation(conversationId, newMessage);
      setOptimisticIds(newMessage.id);

      form.reset();

      // ! Optimistic UI first then add to db
      const { error } = await supabase
        .from("messages")
        .insert(newMessageToDb)
        .select("*, user(email, name, image)")
        // .select("*")
        .single();
      // // Perform the async operation outside the set function

      if (error) {
        removeMessageFromConversation(conversationId, newMessage.id);
        errorToast();
      }

      await sendSlackToAdmin({
        message: newMessage.message,
        conversationId,
        senderId: newMessage.userId,
      });

      if (participantPhoneNumbers) {
        void Promise.all(
          participantPhoneNumbers.map(
            async ({ lastTextAt, phoneNumber, isWhatsApp }) => {
              if (
                phoneNumber &&
                lastTextAt &&
                lastTextAt <= sub(new Date(), { hours: 1 })
              ) {
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
            },
          ),
        );
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

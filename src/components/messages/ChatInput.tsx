import { useConversation } from "@/utils/store/conversations";
import { type ChatMessageType, type GuestMessage, useMessage } from "@/utils/store/messages";
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
  const {data: checkConversationId} = api.messages.checkConversationWithAdmin.useQuery({conversationId: conversationId})

  const addMessageToConversation = useMessage(
    (state) => state.addMessageToConversation,
  );

  const addMessageToAdminConversation = useMessage(
    (state) => state.addMessageToAdminConversation,
  )

  const setConversationToTop = useConversation(
    (state) => state.setConversationToTop,
  );

  const setOptimisticIds = useMessage(
    (state) => state.setOptimisticIds,
  )
  const removeMessageFromConversation = useMessage(
    (state) => state.removeMessageFromConversation,
  );

  const { mutateAsync: updateProfile } = api.users.updateProfile.useMutation();
  const { mutateAsync: sendSMS } = api.twilio.sendSMS.useMutation();

  const { data: participantPhoneNumbers } =
    api.messages.getParticipantsPhoneNumbers.useQuery({ conversationId });

  const twilioWhatsAppMutation = api.twilio.sendWhatsApp.useMutation();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (session && checkConversationId?.conversationId !== conversationId) {

      const newMessage: ChatMessageType = {
        id: nanoid(),
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

      if (error) {
        removeMessageFromConversation(conversationId, newMessage.id);
        errorToast();
      }
    }
      else if(session && checkConversationId?.conversationId === conversationId) {
        const newMessage: ChatMessageType & GuestMessage = {
          id: nanoid(),
          createdAt: new Date().toISOString().slice(0,-1),
          conversationId: conversationId,
          userToken: session.user.id,
          message: values.message,
          read: false,
          isEdit: false,
          userId: "",
        };

        const newMessageToDb = {
          id: newMessage.id,
          conversation_id: newMessage.conversationId,
          user_token: newMessage.userToken,
          message: newMessage.message,
          read: newMessage.read,
          is_edit: newMessage.isEdit,
          created_at: newMessage.createdAt,
        }

        addMessageToAdminConversation(conversationId, newMessage)
        setConversationToTop(conversationId, newMessage)
        setOptimisticIds(newMessage.id);

        const { error } = await supabase
        .from("guest_messages")
        .insert(newMessageToDb)
        // .select("*, user(email, name, image)")
        .select("*")
        .single();

        form.reset();

      if (error) {
        removeMessageFromConversation(conversationId, newMessage.id);
        errorToast();
      }
      

      if (participantPhoneNumbers) {
        void Promise.all(
          participantPhoneNumbers.map(
            async ({ id, lastTextAt, phoneNumber, isWhatsApp }) => {
              if (lastTextAt && lastTextAt <= sub(new Date(), { hours: 1 })) {
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
                  await updateProfile({
                    id: id,
                    lastTextAt: new Date(),
                  });
                }
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
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder="Type a message"
                  className="rounded-xl"
                  autoFocus
                  {...field}
                />
              </FormControl>
              {/* <FormMessage /> */}
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}

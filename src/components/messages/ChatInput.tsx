import { useConversation } from "@/utils/store/conversations";
import { useMessage } from "@/utils/store/messages";
import supabase from "@/utils/supabase-client";
import { errorToast } from "@/utils/toasts";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { Input } from "../ui/input";
import { db } from "@/server/db";
import {
  requests,
  users,
  messages,
  conversations,
  conversationParticipants,
} from "@/server/db/schema";
import { eq, and, ne, inArray } from "drizzle-orm";
import { sendText } from "@/server/server-utils";
import { api } from "@/utils/api";
import MessagesSidebar from "./MessagesSidebar";
import { sub } from "date-fns";

const formSchema = z.object({
  message: z.string().refine((data) => data.trim() !== ""),
});

export default function ChatInput({
  conversationId,
}: {
  conversationId: number;
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

  const { mutate, isLoading } = api.users.updateProfile.useMutation({});


  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (session) {
      // TODO: might be better to update the state first then insert into db
      const { data, error } = await supabase
        .from("messages")
        .insert({
          conversation_id: conversationId,
          user_id: session?.user.id,
          message: values.message,
        })
        .select("*, user(email, name, image)")
        .single();

      if (error) {
        errorToast(error.message);
      }

      if (data) {
        const newMessage = {
          id: data.id,
          createdAt: new Date(data.created_at),
          conversationId: data.conversation_id,
          userId: data.user_id,
          message: data.message,
          read: data.read,
          isEdit: data.is_edit,
          user: {
            name: session.user.name,
            email: session.user.email,
            image: session.user.image ?? "",
          },
        };

        setConversationToTop(conversationId, newMessage);
        addMessageToConversation(conversationId, newMessage);
        setOptimisticIds(newMessage.id);

        const messageId = data.id;

        const user = await db.query.users.findFirst({
          columns: {
            id: true,
            lastTextAt: true,
          },
          where: eq(messages.userId, users.id),
        });

        if (user?.lastTextAt) {
          // const lastTextTime = new Date(user.lastTextAt);
          // const currentTime = new Date();
          // const hourAgo = new Date(currentTime.getTime() - 60 * 60 * 1000);
          if (user.lastTextAt <= sub(new Date(), { hours: 1})) {
            const message = await db.query.messages.findFirst({
              columns: {
                read: true,
                conversationId: true,
                userId: true,
              },
              where: eq(messages.id, messageId),
            });

            if (message && !message.read) {
              // If the message exists and has not been read, send a text to conversation participants

              const participants = await db
                .select({ userId: conversationParticipants.userId })
                .from(conversationParticipants)
                .where(
                  and(
                    eq(
                      conversationParticipants.conversationId,
                      message.conversationId,
                    ),
                    ne(conversationParticipants.userId, message.userId),
                  ),
                );

              const participantIds = participants.flatMap(
                (participant) => participant.userId,
              );

              if (participants) {
                const participantPhoneNumbers = await db
                  .select({ phoneNumber: users.phoneNumber })
                  .from(users)
                  .where(inArray(users.id, participantIds))
                  .leftJoin(
                    conversationParticipants,
                    eq(users.id, conversationParticipants.userId),
                  );

                const promises = participantPhoneNumbers.map(
                  async (participant) => {
                    if (participant.phoneNumber) {
                      await sendText({
                        to: participant.phoneNumber,
                        content: "You have a new unread message!",
                      });
                    }
                  },
                );

                // Wait for all promises to resolve
                await Promise.all(promises);
                mutate({
                  id: user.id,
                  lastTextAt: new Date()
                })
              }
            }
          }
        }

        form.reset();
      }
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mx-2 space-y-8">
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder="Type a message"
                  className="rounded-full"
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

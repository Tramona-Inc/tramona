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

  const utils = api.useUtils();


  const setOptimisticIds = useMessage((state) => state.setOptimisticIds);

  const setConversationToTop = useConversation(
    (state) => state.setConversationToTop,
  );

  const { mutate, isLoading } = api.users.updateProfile.useMutation({});
  const twilioMutation = api.twilio.sendSMS.useMutation();

  const { data: participantPhoneNumbers } =
    api.messages.getParticipantsPhoneNumbers.useQuery({ conversationId });
  const { data: getLastTextAt } = api.users.getLastTextAt.useQuery();

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



          if (participantPhoneNumbers){
            participantPhoneNumbers.map(
              async ({ id, lastTextAt, phoneNumber }) => {
                console.log(lastTextAt);
                if (lastTextAt && lastTextAt <= sub(new Date(), { hours: 1})) {
                  if (phoneNumber) {
                    await twilioMutation.mutateAsync({
                      to: phoneNumber,
                      msg: "You have a new unread message!",
                    });
                    mutate({
                      lastTextAt: new Date(),
                      id: id
                    })
                    await utils.messages.invalidate();
                  }
                }
              },
            );
          }
        }
    }

    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="m-2">
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

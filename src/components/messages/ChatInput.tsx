import { useConversation } from "@/utils/store/conversations";
import { useMessage } from "@/utils/store/messages";
import supabase from "@/utils/supabase-client";
import { errorToast } from "@/utils/toasts";
import { zodResolver } from "@hookform/resolvers/zod";
import { nanoid } from "nanoid";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { Input } from "../ui/input";

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

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (session) {
      const newMessage = {
        id: nanoid(),
        createdAt: new Date(),
        conversationId: conversationId,
        userId: session.user.id,
        message: values.message,
        read: false,
        isEdit: false,
        user: {
          name: session.user.name,
          email: session.user.email,
          image: session.user.image,
        },
      };

      const newMessageToDb = {
        ...newMessage,
        created_at: newMessage.createdAt.toISOString(), // Supbase requires ISOstring
        conversation_id: newMessage.conversationId,
        user_id: newMessage.userId,
        is_edit: newMessage.isEdit,
      };

      setConversationToTop(conversationId, newMessage);
      addMessageToConversation(conversationId, newMessage);
      setOptimisticIds(newMessage.id);

      // ! Optimistic UI first then add to db
      const { error } = await supabase
        .from("messages")
        .insert(newMessageToDb)
        .select("*, user(email, name, image)")
        .single();

      // TODO: removed recently added message from the state
      if (error) {
        errorToast(error.message);
      }

      form.reset();
    }
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

import { useMessage, type ChatMessageType } from "@/utils/store/messages";
import supabase from '@/utils/supabase-client';
import { zodResolver } from "@hookform/resolvers/zod";
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
  conversationId: number;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });

  const { data: session } = useSession();

  const { addMessageToConversation } = useMessage();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (session) {
        const newMessage: ChatMessageType = {
          id: Math.floor(Math.random() * 1000000), //randomn id locally (will not match online)
          createdAt: new Date(),
          conversationId: conversationId,
          userId: session.user.id,
          message: values.message,
          read: false,
          isEdit: false,
          user: {
            name: session.user.name,
            email: session.user.email,
            image: session.user.image ?? "",
          },
        };

        addMessageToConversation(conversationId, newMessage);

        const { error } = await supabase.from("messages").insert({
          conversation_id: conversationId,
          user_id: session?.user.id,
          message: values.message,
        });

        if (error) {
          throw error;
        }

        form.reset();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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

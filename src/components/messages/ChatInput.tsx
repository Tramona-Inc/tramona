import { useMessage } from "@/utils/store/messages";
import supabase from "@/utils/supabase-client";
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

  const addMessageToConversation = useMessage(
    (state) => state.addMessageToConversation,
  );
  const setOptimisticIds = useMessage((state) => state.setOptimisticIds);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
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

          addMessageToConversation(conversationId, newMessage);
          setOptimisticIds(newMessage.id);
        } else {
          throw "No data";
        }

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

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import supabase from "@/utils/supabase-client";
import { Button } from "../../ui/button";
import UserAvatar from "../../_common/UserAvatar";
import { Form, FormControl, FormField, FormItem } from "../../ui/form";
import { type ChatMessageType, useMessage } from "@/utils/store/messages";

import { Input } from "../../ui/input";
import { MessageCircleMore, ArrowUp, X } from "lucide-react";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PopoverClose } from "@radix-ui/react-popover";
import { api } from "@/utils/api";
import { nanoid } from "nanoid";
import { errorToast } from "@/utils/toasts";
import { useSession } from "next-auth/react";
import ListMessagesWithAdmin from "./ListMessagesWithAdmin";
import { useEffect, useState } from "react";

import { type MessageDbType } from "@/types/supabase.message";

export default function MessagesPopover({ isMobile }: { isMobile: boolean }) {
  const { data: session } = useSession();
  const [conversationId, setConversationId] = useState<string>("");
  const [tempToken, setTempToken] = useState<string>("");
  const [open, setOpen] = useState(false);

  const { mutateAsync: createOrRetrieveConversation } =
    api.messages.createConversationWithAdmin.useMutation();
  const { mutateAsync: createOrRetrieveConversationFromGuest } =
    api.messages.createConversationWithAdminFromGuest.useMutation();
  const { mutateAsync: createTempUserForGuest } =
    api.auth.createTempUserForGuest.useMutation();
  const { data: conversationIdAndTempUserId } =
    api.messages.getConversationsWithAdmin.useQuery(
      {
        userId: session?.user.id,
        sessionToken: tempToken,
      },
      {
        enabled: Boolean(session?.user.id ?? tempToken),
      },
    );
  const { mutateAsync: sendChatboxSlackMessage } =
    api.messages.sendChatboxSlackMessage.useMutation();
  const { fetchInitialMessages, conversations } = useMessage();
  // const setOptimisticIds = useMessage((state) => state.setOptimisticIds);

  const messages = conversationId
    ? (conversations[conversationId]?.messages ?? [])
    : [];

  const optimisticIds = useMessage((state) => state.optimisticIds);

  useEffect(() => {
    if (!session && typeof window !== "undefined") {
      const storedToken = localStorage.getItem("tempToken") ?? "";
      setTempToken(storedToken);
      if (!storedToken) {
        const uuid = crypto.randomUUID();
        setTempToken(uuid);
      }
    }
  }, [session]);

  useEffect(() => {
    if (tempToken && !session) {
      const tempUserExists = localStorage.getItem("tempUserCreated");
      if (!tempUserExists) {
        void createTempUserForGuest({
          email: "temp_user@gmail.com",
          isBurner: true,
          sessionToken: tempToken,
        }).then(() => {
          localStorage.setItem("tempUserCreated", "true");
        });
      }
    }
  }, [tempToken, session, createTempUserForGuest]);

  useEffect(() => {
    // Ensure having a valid user ID before making the call (the session is loaded or guest has tempToken)
    if (session?.user.id ?? tempToken) {
      const fetchData = () => {
        try {
          if (conversationIdAndTempUserId) {
            setConversationId(conversationIdAndTempUserId.conversationId);
          }
        } catch (error) {
          errorToast();
        }
      };

      fetchData();
    }
  }, [conversationIdAndTempUserId, session?.user.id, tempToken]);

  useEffect(() => {
    const fetchData = async () => {
      if (conversationId) {
        await fetchInitialMessages(conversationId);
      }
    };
    void fetchData();
  }, [conversationId, fetchInitialMessages]);

  useEffect(() => {
    const channel = supabase
      .channel(conversationId)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        (payload: { new: MessageDbType }) => {
          void handlePostgresChange(payload);
        },
      )
      .subscribe();

    return () => {
      void channel.unsubscribe();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase, messages]);

  const handlePostgresChange = async (payload: { new: MessageDbType }) => {
    if (!optimisticIds.includes(payload.new.id)) {
      const newMessage: ChatMessageType = {
        id: payload.new.id,
        conversationId: payload.new.conversation_id,
        userId: payload.new.user_id,
        message: payload.new.message,
        isEdit: payload.new.is_edit,
        createdAt: payload.new.created_at,
        read: payload.new.read,
      };
      addMessageToConversation(payload.new.conversation_id, newMessage);
      // setOptimisticIds(newMessage.id)
    }
  };

  const addMessageToConversation = useMessage(
    (state) => state.addMessageToConversation,
  );

  const setOptimisticIds = useMessage((state) => state.setOptimisticIds);

  const removeMessageFromConversation = useMessage(
    (state) => state.removeMessageFromConversation,
  );

  const concierge = {
    name: "Blake",
    image:
      "https://lh3.googleusercontent.com/a/ACg8ocJGoxiyA7Dh7_s4C1ftNnkpo4daonbAEClM6bDnZEUyTE-nMmw=s96-c",
  };

  const formSchema = z.object({
    message: z.string(),
  });

  const handleOnSend = async (values: z.infer<typeof formSchema>) => {
    form.reset();
    if (!session) {
      const { tempUserId, conversationId } =
        await createOrRetrieveConversationFromGuest({
          sessionToken: tempToken,
        });
      const newMessage: ChatMessageType = {
        id: nanoid(),
        createdAt: new Date().toISOString().slice(0, -1),
        conversationId: conversationId ?? "",
        message: values.message,
        read: false,
        isEdit: false,
        userId: tempUserId,
      };

      const newMessageToDb = {
        id: newMessage.id,
        conversation_id: newMessage.conversationId,
        message: newMessage.message,
        read: newMessage.read,
        is_edit: newMessage.isEdit,
        created_at: newMessage.createdAt,
        user_id: newMessage.userId,
      };

      addMessageToConversation(conversationId ?? "", newMessage);
      setOptimisticIds(newMessage.id);
      const { error } = await supabase
        .from("messages")
        .insert(newMessageToDb)
        .select("*")
        .single();

      if (error) {
        removeMessageFromConversation(conversationId ?? "", newMessage.id);
        errorToast();
      }
      await sendChatboxSlackMessage({
        message: newMessage.message,
        conversationId: conversationId ?? "",
        senderId: newMessage.userId,
      });
    } else {
      const conversationId = await createOrRetrieveConversation();
      const newMessage: ChatMessageType = {
        id: nanoid(),
        createdAt: new Date().toISOString().slice(0, -1),
        conversationId: conversationId ?? "",
        userId: session.user.id,
        message: values.message,
        read: false,
        isEdit: false,
      };

      const newMessageToDb = {
        id: newMessage.id,
        conversation_id: conversationId ?? "",
        user_id: newMessage.userId,
        message: newMessage.message,
        read: newMessage.read,
        is_edit: newMessage.isEdit,
        created_at: new Date().toISOString(),
      };

      addMessageToConversation(conversationId ?? "", newMessage);
      setOptimisticIds(newMessage.id);
      const { error } = await supabase
        .from("messages")
        .insert(newMessageToDb)
        .select("*, user(email, name, image)")
        .single();

      if (error) {
        removeMessageFromConversation(conversationId ?? "", newMessage.id);
        errorToast();
      }
      await sendChatboxSlackMessage({
        message: newMessage.message,
        conversationId: conversationId ?? "",
        senderId: newMessage.userId,
      });
    }
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  return (
    <>
      {!isMobile ? (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button className="w-18 h-18 bottom-4 right-4 z-50 m-4 hidden rounded-full border p-4 lg:fixed lg:block">
              <MessageCircleMore />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            side="top"
            className="mr-7 rounded-xl border bg-black p-0"
          >
            <div className="relative bg-zinc-800 py-4 text-center text-xs text-white">
              <div className="absolute left-4">
                <PopoverClose>
                  <X />
                </PopoverClose>
              </div>

              <div className="flex items-center justify-center">
                <UserAvatar image={concierge.image} />
              </div>
              <p>Tramona Concierge</p>
              <p>{concierge.name}</p>
            </div>
            <ListMessagesWithAdmin
              messages={messages}
              conversationId={conversationId}
              tempUserId={conversationIdAndTempUserId?.tempUserId ?? ""}
            />
            <div className="p-2">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleOnSend)}>
                  <div className="flex justify-between rounded-full border p-2">
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => {
                        return (
                          <FormItem>
                            <FormControl>
                              <Input
                                placeholder="Type your question here..."
                                className="border-none bg-transparent text-white"
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        );
                      }}
                    />
                    <Button
                      size="icon"
                      type="submit"
                      className="rounded-full bg-blue-800"
                    >
                      <ArrowUp />
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </PopoverContent>
        </Popover>
      ) : (
        <div className="flex h-screen-minus-header-n-footer flex-col justify-between bg-black">
          <div className="relative bg-zinc-800 py-4 text-center text-xs text-white">
            <div className="flex items-center justify-center">
              <UserAvatar image={concierge.image} />
            </div>
            <p>Tramona Concierge</p>
            <p>{concierge.name}</p>
          </div>
          <ListMessagesWithAdmin
            messages={messages}
            isMobile={isMobile}
            conversationId={conversationId}
            tempUserId={conversationIdAndTempUserId?.tempUserId ?? ""}
          />
          <div className="p-2">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleOnSend)}>
                <div className="flex justify-between rounded-full border p-2">
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => {
                      return (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder="Type your question here..."
                              className="border-none bg-transparent text-white"
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      );
                    }}
                  />
                  <Button
                    size="icon"
                    type="submit"
                    className="rounded-full bg-blue-800"
                  >
                    <ArrowUp />
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      )}
    </>
  );
}

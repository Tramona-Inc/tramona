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
import { MessageCircleMore, ArrowUp, X, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PopoverClose } from "@radix-ui/react-popover";
import { api } from "@/utils/api";
import { nanoid } from "nanoid";
import { errorToast } from "@/utils/toasts";
import { useSession } from "next-auth/react";
import ListMessagesWithAdmin from "./ListMessagesWithAdmin";
import { useEffect, useState, useCallback } from "react";
import debounce from "lodash/debounce";
import { type MessageDbType } from "@/types/supabase.message";
import usePopoverStore from "@/utils/store/messagePopoverStore";
import { RealtimePostgresInsertPayload } from "@supabase/supabase-js";
import { useRouter } from 'next/router';

export default function MessagesPopover({
  isMobile,
  isHostOnboarding: _isHostOnboarding,
}: {
  isMobile: boolean;
  isHostOnboarding: boolean;
}) {
  const router = useRouter(); 
  const [isClient, setIsClient] = useState(false);
  const { data: session } = useSession();
  const [conversationId, setConversationId] = useState<string>("");
  const [tempToken, setTempToken] = useState<string>("");
  const { open, setOpen } = usePopoverStore();
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // TRPC mutations and queries
  const { mutateAsync: createOrRetrieveConversation } =
    api.messages.createConversationWithAdmin.useMutation();
  const { mutateAsync: createOrRetrieveConversationFromGuest } =
    api.messages.createConversationWithAdminFromGuest.useMutation();
  const { mutateAsync: createTempUserForGuest } =
    api.auth.createTempUserForGuest.useMutation();
  const { data: conversationIdAndTempUserId } =
    api.messages.getConversationsWithAdmin.useQuery(
      { userId: session?.user.id, sessionToken: tempToken }, 
      { enabled: Boolean(session?.user.id ?? tempToken) }
    );
  const { mutateAsync: sendChatboxSlackMessage } =
    api.messages.sendChatboxSlackMessage.useMutation();
  const { fetchInitialMessages, conversations } = useMessage();

  // Messages handling
  const messages = conversationId
    ? (conversations[conversationId]?.messages ?? []).sort((a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      )
    : [];

  const optimisticIds = useMessage((state) => state.optimisticIds);
  const addMessageToConversation = useMessage(
    (state) => state.addMessageToConversation
  );
  const setOptimisticIds = useMessage((state) => state.setOptimisticIds);
  const removeMessageFromConversation = useMessage(
    (state) => state.removeMessageFromConversation
  );

  // Temp user initialization
  useEffect(() => {
    if (!session && typeof window !== "undefined") {
      let storedToken = localStorage.getItem("tempToken");
      const tempUserExists = localStorage.getItem("tempUserCreated");

      if ((storedToken ?? '') === '' || (tempUserExists ?? '') === '') {
        const newToken = crypto.randomUUID();
        storedToken = newToken;
        localStorage.setItem("tempToken", newToken);
      }

      setTempToken(storedToken ?? '');

      if (!tempUserExists) {
        createTempUserForGuest({
          email: "temp_user@gmail.com",
          isBurner: true,
          sessionToken: storedToken ?? "",
        })
          .then(() => localStorage.setItem("tempUserCreated", "true"))
          .catch((error) => {
            console.error("Temp user creation failed:", error);
            localStorage.removeItem("tempToken");
          });
      }
    }
  }, [session, createTempUserForGuest]);

  // Conversation handling
  useEffect(() => {
    const storedConversationId = localStorage.getItem("currentConversation");
    if (storedConversationId) {
      setConversationId(storedConversationId);
      void fetchInitialMessages(storedConversationId);
    } else if (session && conversationIdAndTempUserId) {
      setConversationId(conversationIdAndTempUserId.conversationId);
      localStorage.setItem(
        "currentConversation",
        conversationIdAndTempUserId.conversationId
      );
      void fetchInitialMessages(conversationIdAndTempUserId.conversationId);
    }
  }, [conversationIdAndTempUserId, session, fetchInitialMessages]);

  useEffect(() => {
    if (conversationId) {
      void fetchInitialMessages(conversationId);
    }
  }, [conversationId, fetchInitialMessages]);

  // Real-time subscription
  const handlePostgresChange = useCallback(
    async (payload: RealtimePostgresInsertPayload<MessageDbType>) => {
      const currentIds = useMessage.getState().optimisticIds;
      
      if (optimisticIds.includes(payload.new.id)) {
        // Correctly update the optimisticIds state
        setOptimisticIds(currentIds.filter(id => id !== payload.new.id));
        return;
      }

      const newMessage = {
        id: payload.new.id,
        conversationId: payload.new.conversation_id,
        userId: payload.new.user_id,
        message: payload.new.message,
        isEdit: payload.new.is_edit,
        createdAt: payload.new.created_at,
        read: payload.new.read,
      };

      addMessageToConversation(newMessage.conversationId, newMessage);
    },
    [optimisticIds, setOptimisticIds, addMessageToConversation]
  );

  useEffect(() => {
    if (!conversationId) return;

    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          // Use void to ensure the function returns void
          void (async () => {
            try {
              await handlePostgresChange(payload as RealtimePostgresInsertPayload<MessageDbType>);
            } catch (error) {
              console.error("Error handling postgres change:", error);
            }
          })();
        }
      )
      .subscribe();

    return () => {
      void channel.unsubscribe().catch((error) => {
        console.error("Error unsubscribing from channel:", error);
      });
    };
  }, [conversationId, handlePostgresChange]);

  // Form handling
  const formSchema = z.object({
    message: z.string().min(1, "Message cannot be empty"),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { message: "" },
  });

  const handleOnSend = async (values: z.infer<typeof formSchema>) => {
    if (isSending) return;
    setIsSending(true);
  
    try {
      if (!session) {
        if (!tempToken) {
          errorToast("Session error. Please refresh the page.");
          return;
        }
  
        const { tempUserId, conversationId: newConversationId } =
          await createOrRetrieveConversationFromGuest({
            sessionToken: tempToken,
          });
  
        setConversationId(newConversationId);
        localStorage.setItem("currentConversation", newConversationId);
  
        const messageId = nanoid();
        const currentIds = useMessage.getState().optimisticIds;
  
        const newMessage: ChatMessageType = {
          id: messageId,
          createdAt: new Date().toISOString(),
          conversationId: newConversationId,
          message: values.message,
          read: false,
          isEdit: false,
          userId: tempUserId,
        };
  
        addMessageToConversation(newConversationId, newMessage);
        setOptimisticIds([...currentIds, messageId]);
  
        const { error } = await supabase
          .from("messages")
          .insert({
            id: messageId,
            conversation_id: newConversationId,
            user_id: tempUserId,
            message: newMessage.message,
            read: false,
            is_edit: false,
            created_at: new Date().toISOString(),
          })
          .select("*")
          .single();
        
        setOptimisticIds(currentIds.filter(id => id !== messageId));
        
        if (error) {
          removeMessageFromConversation(newConversationId, messageId);
          setOptimisticIds(currentIds.filter(id => id !== messageId));
          throw error;
        }
  
        await fetchInitialMessages(newConversationId);
        await sendChatboxSlackMessage({
          message: newMessage.message,
          conversationId: newConversationId,
          senderId: tempUserId,
        });
  
        form.reset();
      } else {
        const convId = await createOrRetrieveConversation();
        const messageId = nanoid();
        const currentIds = useMessage.getState().optimisticIds;
  
        const newMessage: ChatMessageType = {
          id: messageId,
          createdAt: new Date().toISOString(),
          conversationId: convId,
          userId: session.user.id,
          message: values.message,
          read: false,
          isEdit: false,
        };
  
        addMessageToConversation(convId, newMessage);
        setOptimisticIds([...currentIds, messageId]);
  
        const { error } = await supabase
          .from("messages")
          .insert({
            id: messageId,
            conversation_id: convId,
            user_id: session.user.id,
            message: newMessage.message,
            read: false,
            is_edit: false,
            created_at: new Date().toISOString(),
          })
          .select("*, user(email, name, image)")
          .single();
  
        if (error) {
          removeMessageFromConversation(convId, messageId);
          setOptimisticIds(currentIds.filter(id => id !== messageId));
          throw error;
        }
  
        await sendChatboxSlackMessage({
          message: newMessage.message,
          conversationId: convId,
          senderId: session.user.id,
        }).catch((error) => {
          console.error("Error sending Slack message:", error);
        });
        form.reset();
        await router.push('/messages');
      }
    } catch (error) {
      console.error("Error sending message:", error);
      errorToast("Failed to send message. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  // Popover controls
  const debouncedSetOpen = useCallback(
    (value: boolean) => debounce(() => setOpen(value), 100)(),
    [setOpen]
  );

  const handleOpenChange = (value: boolean) => {
    debouncedSetOpen(value);
  };

  const concierge = {
    name: "Blake",
    image: "https://lh3.googleusercontent.com/a/ACg8ocJGoxiyA7Dh7_s4C1ftNnkpo4daonbAEClM6bDnZEUyTE-nMmw=s96-c",
  };

  const uniqueMessages = messages.filter(
    (message, index, self) =>
      index === self.findIndex((m) => m.id === message.id)
  );

  return (
    <>
      {isClient && (
        <>
          {!isMobile ? (
            <Popover open={open} onOpenChange={handleOpenChange}>
              <PopoverTrigger asChild>
                <Button className="w-18 h-18 bottom-4 right-4 z-50 m-4 hidden rounded-full border bg-[#004236] p-4 hover:bg-[#004236]/90 lg:fixed lg:block">
                  <MessageCircleMore className="text-white" />
                </Button>
              </PopoverTrigger>
              <PopoverContent side="top" className="mr-7 rounded-xl border bg-white p-0">
                <div className="relative bg-[#004236] py-4 text-center text-xs text-white">
                  <div className="absolute left-4">
                    <PopoverClose>
                      <X className="text-white" />
                    </PopoverClose>
                  </div>
                  <div className="flex items-center justify-center">
                    <UserAvatar image={concierge.image} />
                  </div>
                  <p>Tramona Concierge</p>
                  <p>{concierge.name}</p>
                </div>
                <ListMessagesWithAdmin
                  messages={uniqueMessages}
                  tempUserId={conversationIdAndTempUserId?.tempUserId ?? ""}
                />
                <div className="p-4">
                  <Form {...form}>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        void form.handleSubmit(handleOnSend)(e);
                      }}
                    >
                      <div className="flex h-12 rounded-full border border-[#004236] bg-gray-50 shadow-sm">
                        <FormField
                          control={form.control}
                          name="message"
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormControl>
                                <input
                                  placeholder="Type your question here..."
                                  className="flex h-full w-full items-center justify-center border-none bg-transparent px-4 leading-none text-black placeholder:text-center placeholder:text-gray-500 focus:outline-none"
                                  {...field}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                       <Button
                          size="icon"
                          type="submit"
                          className="my-1 mr-1 rounded-full bg-[#004236] transition-colors hover:bg-[#004236]/90"
                          disabled={isSending}
                        >
                          {isSending ? (
                            <Loader2 className="h-4 w-4 text-white animate-spin" />
                          ) : (
                            <ArrowUp className="h-4 w-4 text-white" />
                          )}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </div>
              </PopoverContent>
            </Popover>
          ) : (
            <div className="flex h-screen flex-col bg-white">
              <div className="flex-1 overflow-y-auto p-4">
                <ListMessagesWithAdmin
                  messages={uniqueMessages}
                  tempUserId={conversationIdAndTempUserId?.tempUserId ?? ""}
                />
              </div>
              <div className="sticky bottom-[60px] z-50 bg-white p-4 shadow-sm">
                <Form {...form}>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      void form.handleSubmit(handleOnSend)(e);
                    }}
                  >
                    <div className="flex h-12 rounded-full border border-[#004236] bg-gray-50 shadow-sm">
                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <input
                                placeholder="Type your question here..."
                                className="flex h-full w-full items-center justify-center border-none bg-transparent px-4 leading-none text-black placeholder:text-center placeholder:text-gray-500 focus:outline-none"
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <Button
                        size="icon"
                        type="submit"
                        className="my-1 mr-1 rounded-full bg-[#004236] transition-colors hover:bg-[#004236]/90"
                        disabled={isSending}
                      >
                        <ArrowUp className="h-4 w-4 text-white" />
                      </Button>
                    </div>
                  </form>
                </Form>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}



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
//Parwizstart: added useCallback for memoization ( without it the debounced would be recreated every rendering causing a problem than a solution)
import { useEffect, useState, useCallback } from "react";
//debounce was added to prevent too many state updates because it was causing errors (when opening and closing chat popover)
import debounce from "lodash/debounce";
//Parwizstart: added useCallback for memoization ( without it the debounced would be recreated every rendering causing a problem than a solution)
import { useEffect, useState, useCallback } from "react";
//debounce was added to prevent too many state updates because it was causing errors (when opening and closing chat popover)
import debounce from "lodash/debounce";
import { type MessageDbType } from "@/types/supabase.message";
import usePopoverStore from "@/utils/store/messagePopoverStore";
export default function MessagesPopover({
  isMobile,
  isHostOnboarding,
}: {
  isMobile: boolean;
  isHostOnboarding: boolean;
}) {
  // ParwizStart - Added state for client-side rendering
  // Handle server-side vs client-side rendering mismatch
  // Component only renders after it's mounted in the browser
  // This prevents hydration errors in Next.js
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);
  // ParwizEnd

  // ParwizStart - Added state for client-side rendering
  // Handle server-side vs client-side rendering mismatch
  // Component only renders after it's mounted in the browser
  // This prevents hydration errors in Next.js
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);
  // ParwizEnd

  const { data: session } = useSession();
  const [conversationId, setConversationId] = useState<string>("");
  const [tempToken, setTempToken] = useState<string>("");
  const { open, setOpen } = usePopoverStore();

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
  //sort the messages by date
  //will bring the latest message to the bottom and oldest in top
  //sort the messages by date
  //will bring the latest message to the bottom and oldest in top
  const messages = conversationId
    ? (() => {
        const messagesList = conversations[conversationId]?.messages ?? [];
        return messagesList.sort((messageA, messageB) => {
          const dateA = new Date(messageA.createdAt).getTime();
          const dateB = new Date(messageB.createdAt).getTime();
          // Compare dates (newer messages first)
          return dateB - dateA;
        });
      })()
    ? (() => {
        const messagesList = conversations[conversationId]?.messages ?? [];
        return messagesList.sort((messageA, messageB) => {
          const dateA = new Date(messageA.createdAt).getTime();
          const dateB = new Date(messageB.createdAt).getTime();
          // Compare dates (newer messages first)
          return dateB - dateA;
        });
      })()
    : [];

  const optimisticIds = useMessage((state) => state.optimisticIds);

  useEffect(() => {
    if (!session && typeof window !== "undefined") {
      let storedToken = localStorage.getItem("tempToken");
      const tempUserExists = localStorage.getItem("tempUserCreated");

      if (!storedToken || !tempUserExists) {
        const newToken = crypto.randomUUID();
        storedToken = newToken;
        localStorage.setItem("tempToken", newToken);
      }

      setTempToken(storedToken);

      // Check if temp user exists in the database
      if (!tempUserExists) {
        void createTempUserForGuest({
          email: "temp_user@gmail.com",
          isBurner: true,
          sessionToken: storedToken,
        })
          .then(() => {
            localStorage.setItem("tempUserCreated", "true");
          })
          .catch((error) => {
            console.error("Failed to create temporary user:", error);
            localStorage.removeItem("tempToken"); // Clear invalid token
          });
      }
    }
  }, [session, createTempUserForGuest]);

  useEffect(() => {
    // Ensure having a valid user ID before making the call (the session is loaded or guest has tempToken)
    if ((session !== null || tempToken) && conversationIdAndTempUserId) {
      setConversationId(conversationIdAndTempUserId.conversationId);
    }
  }, [conversationIdAndTempUserId, session, tempToken]);

  useEffect(() => {
    const fetchData = async () => {
      if (conversationId) {
        await fetchInitialMessages(conversationId);
      }
    };
    void fetchData();
  }, [conversationId, fetchInitialMessages]);

  useEffect(() => {
    if (!conversationId) return;
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
  }, [messages, conversationId]);

  const handlePostgresChange = async (payload: { new: MessageDbType }) => {
    // Add console.log to debug message handling
    console.log("Message received:", payload.new);
    console.log("Optimistic IDs:", optimisticIds);

    // Only add message if it's not an optimistic update
    // Add console.log to debug message handling
    console.log("Message received:", payload.new);
    console.log("Optimistic IDs:", optimisticIds);

    // Only add message if it's not an optimistic update
    if (!optimisticIds.includes(payload.new.id)) {
      //parwizstart: change newmessage from direct object creation in function to first create a message then add to payload function
      //we can reuse newMessage in other functions now if need be
      const newMessage = {
      //parwizstart: change newmessage from direct object creation in function to first create a message then add to payload function
      //we can reuse newMessage in other functions now if need be
      const newMessage = {
        id: payload.new.id,
        conversationId: payload.new.conversation_id,
        userId: payload.new.user_id,
        message: payload.new.message,
        isEdit: payload.new.is_edit,
        createdAt: payload.new.created_at,
        read: payload.new.read,
      };

      // Force a small delay to ensure message state is updated
      setTimeout(() => {
        addMessageToConversation(payload.new.conversation_id, newMessage);
      }, 100);
      };

      // Force a small delay to ensure message state is updated
      setTimeout(() => {
        addMessageToConversation(payload.new.conversation_id, newMessage);
      }, 100);
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

  // ParwizStart - Added validation to ensure message is not empty
  // Original:
  // const formSchema = z.object({
  //   message: z.string(),
  // });
  // Updated: requires the string to be at least 1 character long
  //
  // ParwizStart - Added validation to ensure message is not empty
  // Original:
  // const formSchema = z.object({
  //   message: z.string(),
  // });
  // Updated: requires the string to be at least 1 character long
  //
  const formSchema = z.object({
    message: z.string().min(1, "Message cannot be empty"),
  });
  // ParwizEnd

  const handleOnSend = async (values: z.infer<typeof formSchema>) => {
    //parwizstart: this where I changed the structure of the message to be sent to the db
    //for error handling I added a try catch block
    //if something went wrong with messages or the db the errors at the end will go on
    try {
      form.reset();

      if (!session) {
        //parwiz start: Added validation for guest user token
        if (!tempToken) {
          errorToast("Unable to send message. Please try again.");
          return;
        }
        //parwizend

        const { tempUserId, conversationId } =
          await createOrRetrieveConversationFromGuest({
            sessionToken: tempToken,
          });
        //parwizstart: added conversationId to the state to update for guest user
        setConversationId(conversationId);
        //parwizend
        const newMessage: ChatMessageType = {
          id: nanoid(),
          createdAt: new Date().toISOString().slice(0, -1),
          conversationId: conversationId,
          message: values.message,
          read: false,
          isEdit: false,
          userId: tempUserId,
        };
    //parwizstart: this where I changed the structure of the message to be sent to the db
    //for error handling I added a try catch block
    //if something went wrong with messages or the db the errors at the end will go on
    try {
      form.reset();

      if (!session) {
        //parwiz start: Added validation for guest user token
        if (!tempToken) {
          errorToast("Unable to send message. Please try again.");
          return;
        }
        //parwizend

        const { tempUserId, conversationId } =
          await createOrRetrieveConversationFromGuest({
            sessionToken: tempToken,
          });
        //parwizstart: added conversationId to the state to update for guest user
        setConversationId(conversationId);
        //parwizend
        const newMessage: ChatMessageType = {
          id: nanoid(),
          createdAt: new Date().toISOString().slice(0, -1),
          conversationId: conversationId,
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
        const newMessageToDb = {
          id: newMessage.id,
          conversation_id: newMessage.conversationId,
          message: newMessage.message,
          read: newMessage.read,
          is_edit: newMessage.isEdit,
          created_at: newMessage.createdAt,
          user_id: newMessage.userId,
        };

        addMessageToConversation(conversationId, newMessage);
        setOptimisticIds(newMessage.id);
        const { error } = await supabase
          .from("messages")
          .insert(newMessageToDb)
          .select("*")
          .single();

        if (error) {
          removeMessageFromConversation(conversationId, newMessage.id);
          errorToast();
        }
        await sendChatboxSlackMessage({
          message: newMessage.message,
          conversationId: conversationId,
          senderId: newMessage.userId,
        });
      } else {
        const conversationId = await createOrRetrieveConversation();
        const newMessage: ChatMessageType = {
          id: nanoid(),
          createdAt: new Date().toISOString().slice(0, -1),
          conversationId: conversationId,
          userId: session.user.id,
          message: values.message,
          read: false,
          isEdit: false,
        };
        if (error) {
          removeMessageFromConversation(conversationId, newMessage.id);
          errorToast();
        }
        await sendChatboxSlackMessage({
          message: newMessage.message,
          conversationId: conversationId,
          senderId: newMessage.userId,
        });
      } else {
        const conversationId = await createOrRetrieveConversation();
        const newMessage: ChatMessageType = {
          id: nanoid(),
          createdAt: new Date().toISOString().slice(0, -1),
          conversationId: conversationId,
          userId: session.user.id,
          message: values.message,
          read: false,
          isEdit: false,
        };

        const newMessageToDb = {
          id: newMessage.id,
          conversation_id: conversationId,
          user_id: newMessage.userId,
          message: newMessage.message,
          read: newMessage.read,
          is_edit: newMessage.isEdit,
          created_at: new Date().toISOString(),
        };

        addMessageToConversation(conversationId, newMessage);
        setOptimisticIds(newMessage.id);
        const { error } = await supabase
          .from("messages")
          .insert(newMessageToDb)
          .select("*, user(email, name, image)")
          .single();
        addMessageToConversation(conversationId, newMessage);
        setOptimisticIds(newMessage.id);
        const { error } = await supabase
          .from("messages")
          .insert(newMessageToDb)
          .select("*, user(email, name, image)")
          .single();

        if (error) {
          removeMessageFromConversation(conversationId, newMessage.id);
          errorToast();
        }
        await sendChatboxSlackMessage({
          message: newMessage.message,
          conversationId: conversationId,
          senderId: newMessage.userId,
        });
      }
    } catch (error) {
      console.error("Error sending message:", error);
      errorToast("Failed to send message. Please try again.");
        if (error) {
          removeMessageFromConversation(conversationId, newMessage.id);
          errorToast();
        }
        await sendChatboxSlackMessage({
          message: newMessage.message,
          conversationId: conversationId,
          senderId: newMessage.userId,
        });
      }
    } catch (error) {
      console.error("Error sending message:", error);
      errorToast("Failed to send message. Please try again.");
    }
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    //ParwizStart - Added explicit default values for the form
    defaultValues: {
      //default value would be empty string if no message is provided
      message: "",
    },
    //parwizend:
  });

  useEffect(() => {
    if (isHostOnboarding) {
      // Set a default message if onboarding is true
      form.setValue(
        "message",
        "I need help with host onboarding. I had an issue logging in with Hospitable.",
      );
    }
  }, [isHostOnboarding, form]);

  // ParwizStart - only allow state updates every 100ms
  //this is why I imported the debounce from lodash library
  const debouncedSetOpen = useCallback(
    debounce((value: boolean) => {
      setOpen(value);
    }, 100),
    [],
  );

  const handleOpenChange = (value: boolean) => {
    debouncedSetOpen(value);
  };
  // ParwizEnd

  return (
    // ParwizStart - Added conditional rendering
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
              <PopoverContent
                side="top"
                className="mr-7 rounded-xl border bg-white p-0"
              >
                <div className="relative bg-[#004236] py-4 text-center text-xs text-white">
                  <div className="absolute left-4">
                    <PopoverClose>
                      <X className="text-white" />
                    </PopoverClose>
                  </div>
    // ParwizStart - Added conditional rendering
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
              <PopoverContent
                side="top"
                className="mr-7 rounded-xl border bg-white p-0"
              >
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
                  messages={messages}
                  tempUserId={conversationIdAndTempUserId?.tempUserId ?? ""}
                />
                <div className="p-4">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleOnSend)}>
                      <div className="flex h-12 rounded-full border border-[#004236] bg-gray-50 shadow-sm">
                        <FormField
                          control={form.control}
                          name="message"
                          render={({ field }) => {
                            return (
                              <FormItem className="flex-1">
                                <FormControl>
                                  <input
                                    placeholder="Type your question here..."
                                    className="flex h-full w-full items-center justify-center border-none bg-transparent px-4 leading-none text-black placeholder:text-center placeholder:text-gray-500 focus:outline-none"
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
                          className="my-1 mr-1 rounded-full bg-[#004236] transition-colors hover:bg-[#004236]/90"
                        >
                          <ArrowUp className="h-4 w-4 text-white" />
                        </Button>
                      </div>
                    </form>
                  </Form>
                </div>
              </PopoverContent>
            </Popover>
          ) : (
            <div className="flex h-screen-minus-header-n-footer flex-col justify-between bg-white">
              <div className="relative bg-[#004236] py-4 text-center text-xs text-white">
                <div className="flex items-center justify-center">
                  <UserAvatar image={concierge.image} />
                </div>
                <p>Tramona Concierge</p>
                <p>{concierge.name}</p>
              </div>
              <ListMessagesWithAdmin
                messages={messages}
                isMobile={isMobile}
                tempUserId={conversationIdAndTempUserId?.tempUserId ?? ""}
              />
              <div className="mx-auto mb-20 w-[95%] p-2">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleOnSend)}>
                    <div className="flex rounded-full border border-[#004236] p-2">
                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => {
                          return (
                            <FormItem className="flex-1">
                              <FormControl>
                                <Input
                                  placeholder="Type your question here..."
                                  className="border-none bg-transparent text-black placeholder:text-center"
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
                        className="rounded-full bg-[#004236]"
                      >
                        <ArrowUp className="text-white" />
                      </Button>
                    </div>
                  </form>
                </Form>
              </div>
            </div>
          )}
        </>
                  <div className="flex items-center justify-center">
                    <UserAvatar image={concierge.image} />
                  </div>
                  <p>Tramona Concierge</p>
                  <p>{concierge.name}</p>
                </div>
                <ListMessagesWithAdmin
                  messages={messages}
                  tempUserId={conversationIdAndTempUserId?.tempUserId ?? ""}
                />
                <div className="p-4">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleOnSend)}>
                      <div className="flex h-12 rounded-full border border-[#004236] bg-gray-50 shadow-sm">
                        <FormField
                          control={form.control}
                          name="message"
                          render={({ field }) => {
                            return (
                              <FormItem className="flex-1">
                                <FormControl>
                                  <input
                                    placeholder="Type your question here..."
                                    className="flex h-full w-full items-center justify-center border-none bg-transparent px-4 leading-none text-black placeholder:text-center placeholder:text-gray-500 focus:outline-none"
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
                          className="my-1 mr-1 rounded-full bg-[#004236] transition-colors hover:bg-[#004236]/90"
                        >
                          <ArrowUp className="h-4 w-4 text-white" />
                        </Button>
                      </div>
                    </form>
                  </Form>
                </div>
              </PopoverContent>
            </Popover>
          ) : (
            <div className="flex h-screen-minus-header-n-footer flex-col justify-between bg-white">
              <div className="relative bg-[#004236] py-4 text-center text-xs text-white">
                <div className="flex items-center justify-center">
                  <UserAvatar image={concierge.image} />
                </div>
                <p>Tramona Concierge</p>
                <p>{concierge.name}</p>
              </div>
              <ListMessagesWithAdmin
                messages={messages}
                isMobile={isMobile}
                tempUserId={conversationIdAndTempUserId?.tempUserId ?? ""}
              />
              <div className="mx-auto mb-20 w-[95%] p-2">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleOnSend)}>
                    <div className="flex rounded-full border border-[#004236] p-2">
                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => {
                          return (
                            <FormItem className="flex-1">
                              <FormControl>
                                <Input
                                  placeholder="Type your question here..."
                                  className="border-none bg-transparent text-black placeholder:text-center"
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
                        className="rounded-full bg-[#004236]"
                      >
                        <ArrowUp className="text-white" />
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

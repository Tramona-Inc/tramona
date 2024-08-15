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
import Link from "next/link";

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

let tempToken: string;

export default function MessagesPopover() {
  const { data: session } = useSession();

  const { mutateAsync: createOrRetrieveConversation } =
    api.messages.createConversationWithAdmin.useMutation();
  const { mutateAsync: createOrRetrieveConversationFromGuest } =
    api.messages.createConversationWithAdminFromGuest.useMutation();
  const { mutateAsync: createTempUserForGuest } =
    api.auth.createTempUserForGuest.useMutation();

  if (!session && typeof window !== "undefined") {
    tempToken = localStorage.getItem("tempToken") ?? "";
    if (!tempToken) {
      tempToken = crypto.randomUUID();
      void createTempUserForGuest({
        email: "temp_user@gmail.com",
        isGuest: true,
        sessionToken: tempToken,
      });
      localStorage.setItem("tempToken", tempToken);
      // it's not safe to save temp userId to local storage, so here we use tempToken as guest user identifier
    }
  }

  const { data: conversationIdAndTempUserId } =
    api.messages.getConversationsWithAdmin.useQuery({
      userId: session?.user.id,
      sessionToken: tempToken,
    });
  const { conversationId, tempUserId } = conversationIdAndTempUserId ?? {};

  const addMessageToConversation = useMessage(
    (state) => state.addMessageToConversation,
  );

  const setOptimisticIds = useMessage((state) => state.setOptimisticIds);

  const removeMessageFromConversation = useMessage(
    (state) => state.removeMessageFromConversation,
  );

  const { conversations } = useMessage();

  const { fetchInitialMessages } = useMessage();

  void fetchInitialMessages(conversationId ?? "");

  const messages = conversationId
    ? (conversations[conversationId]?.messages ?? [])
    : [];

  const sender = {
    name: "Tramona Info",
    image:
      "https://lh3.googleusercontent.com/a/ACg8ocLm7RrPPFKJd_jo8vFOMMZc_nj-u30AgO5YCx6keJbu04P0cnE=s96-c",
  };

  const formSchema = z.object({
    message: z.string(),
  });

  const handleOnSend = async (values: z.infer<typeof formSchema>) => {
    // create conversation id if it doesnot exist
    // TODO: handle guest (in session and not session)
    // console.log(conversationId)

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
        // .select("*, user(email, name, image)")
        .select("*")
        .single();

      if (error) {
        removeMessageFromConversation(conversationId ?? "", newMessage.id);
        errorToast();
      }
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
    }
    form.reset();
  };
  //   console.log(messages)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          {session?.user.role !== "host" && session?.user.role !== "admin" ? (
            <Button className="w-18 h-18 bottom-4 right-4 z-50 m-4 hidden rounded-full border p-4 lg:fixed lg:block">
              <MessageCircleMore />
            </Button>
          ) : (
            <></>
          )}
        </PopoverTrigger>
        <PopoverContent className="mx-8 grid h-[35rem] w-[21rem] grid-rows-1 rounded-xl border border-gray-800 bg-black p-0">
          <div className="grid grid-rows-1">
            <div className="flex flex-col">
              <div className="flex h-[7rem] w-full flex-col items-center justify-start bg-[#1A1A1A] p-4 text-base font-bold text-white">
                <UserAvatar image={session?.user.image ?? sender?.image} />
                <p className="pt-1 text-xs font-light text-muted-foreground antialiased">
                  Concierge
                </p>
                <p className="flex-1 px-2 text-sm font-medium antialiased">
                  Tramona Info
                </p>
              </div>
              <PopoverClose>
                <X className="fixed left-12 top-4 text-white" />
              </PopoverClose>

              <ListMessagesWithAdmin />
            </div>
            <div className="mx-4 my-2 flex h-max flex-row items-center gap-2 rounded-full border border-gray-500 p-1">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleOnSend)}
                  className="flex w-full flex-row"
                >
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => {
                      return (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input
                              placeholder="Type your question here..."
                              className="flex w-full rounded-xl border-0 bg-transparent text-sm text-white"
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      );
                    }}
                  />

                  <Button
                    className="rounded-full bg-[#0D4273] px-2"
                    size="icon"
                    type="submit"
                  >
                    <ArrowUp className="text-xs antialiased" />
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <div className="grid h-screen-minus-header-n-footer w-screen grid-rows-1 border border-gray-800 bg-black p-0 sm:hidden md:grid md:h-screen-minus-header-n-footer lg:hidden">
        <div className="flex flex-col">
          <div className="flex h-[7rem] w-full flex-col items-center justify-start bg-[#1A1A1A] p-4 text-base font-bold text-white">
            <UserAvatar image={session?.user.image} />
            <p className="pt-1 text-xs font-light text-muted-foreground antialiased">
              Concierge
            </p>
            <p className="flex-1 px-2 text-sm font-medium antialiased">
              {sender?.name ?? "Tramona Info"}
            </p>
            <Button asChild className="absolute right-3 top-2 bg-inherit p-0">
              <Link href="/">
                <X className="text-white" />
              </Link>
            </Button>
          </div>
          <ListMessagesWithAdmin />
        </div>
        <div className="mx-4 my-2 flex h-max flex-row items-center gap-2 rounded-full border border-gray-500 p-1">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleOnSend)}
              className="flex w-full flex-row"
            >
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => {
                  return (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input
                          placeholder="Type your question here..."
                          className="flex w-full rounded-xl border-0 bg-transparent text-sm text-white"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  );
                }}
              />
              <Button
                className="rounded-full bg-[#0D4273] px-2"
                size="icon"
                type="submit"
              >
                <ArrowUp className="text-xs antialiased" />
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
}

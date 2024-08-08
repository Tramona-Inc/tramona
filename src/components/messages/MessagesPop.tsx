import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import supabase from "@/utils/supabase-client";
import { Button } from "../ui/button";
import UserAvatar from "../_common/UserAvatar";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import {
  type ChatMessageType,
  type GuestMessage,
  useMessage,
} from "@/utils/store/messages";
import Link from "next/link";

import { Input } from "../ui/input";
import { MessageCircleMore, ArrowUp, X } from "lucide-react";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PopoverClose } from "@radix-ui/react-popover";
import { api } from "@/utils/api";
import { nanoid } from "nanoid";
import { errorToast } from "@/utils/toasts";
import AdminMessages from "./AdminMessages";
import { useSession } from "next-auth/react";
// import { useMediaQuery } from "@/components/_utils/useMediaQuery";

// import { createConversationWithAdmin } from '@/server/api/routers/messagesRouter';

let tempToken: string;

export default function MessagesPopover() {
  const { data: session } = useSession();
  const { mutateAsync: createConversation } =
    api.messages.createConversationWithAdmin.useMutation();

  if (!session && typeof window !== "undefined") {
    tempToken = localStorage.getItem("tempToken") ?? "";
    if (!tempToken) {
      tempToken = crypto.randomUUID();
      localStorage.setItem("tempToken", tempToken);
    }
  }

  const { data: conversationId } =
    api.messages.getConversationsWithAdmin.useQuery({
      uniqueId: session?.user.id ?? tempToken,
      session: session ? true : false,
    });

  //  const { fetchInitialMessages } = useMessage()
  // void fetchInitialMessages(conversationId ?? "")
  // const isMobile = useMediaQuery("(max-width:648px)")
  const addMessageToConversation = useMessage(
    (state) => state.addMessageToConversation,
  );
  const addMessageToAdminConversation = useMessage(
    (state) => state.addMessageToAdminConversation,
  );

  const setOptimisticIds = useMessage((state) => state.setOptimisticIds);

  const removeMessageFromConversation = useMessage(
    (state) => state.removeMessageFromConversation,
  );

  const { conversations } = useMessage();
  const { adminConversations } = useMessage();

  const { fetchInitialMessages, fetchMessagesForGuest } = useMessage();

  if (!session) {
    void fetchMessagesForGuest(conversationId ?? "");
  }else{
    void fetchInitialMessages(conversationId ?? "");
  }

  const messages = conversationId
    ? (conversations[conversationId]?.messages ?? [])
    : [];

  const adminMessages = conversationId
    ? (adminConversations[conversationId]?.messages ?? [])
    : [];

  const adminDetails = session
    ? messages.find(
        (message) => "userId" in message && message.userId !== session.user.id,
      )
    : adminMessages.find(
        (message) => "userToken" in message && message.userToken !== tempToken,
      );
  // console.log(adminDetails);
  const { data: sender } =
    session && adminDetails
      ? api.messages.fetchAdminDetails.useQuery({
          adminId: (adminDetails as ChatMessageType)?.userId,
        })
      : api.messages.fetchAdminDetails.useQuery({
          adminId: (adminDetails as GuestMessage)?.userToken ?? "",
        });

  const formSchema = z.object({
    message: z.string(),
  });

  // const {data: conversation_id} = api.messages.getConversationsWithAdmin.useQuery({uniqueId: temporary_token});

  const handleOnSend = async (values: z.infer<typeof formSchema>) => {
    //create conversation id if it doesnot exist
    const conversationId = await createConversation({
      uniqueId: session?.user.id ?? tempToken,
      session: session ? true : false,
    });
    // console.log(conversationId)

    if (!session) {
      const newMessage: ChatMessageType & GuestMessage = {
        id: nanoid(),
        createdAt: new Date().toISOString().slice(0, -1),
        conversationId: conversationId ?? "",
        userToken: tempToken,
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
      };

      addMessageToAdminConversation(conversationId ?? "", newMessage);
      setOptimisticIds(newMessage.id);
      // setConversationToTop(conversationId ?? "", newMessage)
      const { error } = await supabase
        .from("guest_messages")
        .insert(newMessageToDb)
        // .select("*, user(email, name, image)")
        .select("*")
        .single();

      if (error) {
        removeMessageFromConversation(conversationId ?? "", newMessage.id);
        errorToast();
      }
    } else {
      const newMessage: ChatMessageType & GuestMessage = {
        id: nanoid(),
        createdAt: new Date().toISOString().slice(0, -1),
        conversationId: conversationId ?? "",
        userId: session.user.id, //user is logged in
        userToken: "", //user is logged out
        message: values.message,
        read: false,
        isEdit: false,
      };

      const newMessageToDb = {
        id: newMessage.id,
        conversation_id: conversationId ?? "",
        user_id: newMessage.userId,
        message: newMessage.message,
        // userToken: "",
        read: newMessage.read,
        is_edit: newMessage.isEdit,
        created_at: new Date().toISOString(),
      };

      // setConversationToTop(conversationId ?? "", newMessage);
      addMessageToConversation(conversationId ?? "", newMessage);
      setOptimisticIds(newMessage.id);
      const { error } = await supabase
        .from("messages")
        .insert(newMessageToDb)
        .select("*, user(email, name, image)")
        // .select("*")
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
      {/* <div className="fixed bottom-0 right-0 z-50"> */}
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
                  {sender?.name ?? "Tramona Host"}
                </p>
              </div>
              <PopoverClose>
                <X className="fixed left-12 top-4 text-white" />
              </PopoverClose>
              {/* {!session ?? 
              <AdminMessages conversationId={conversationId} />

            } */}
              {/* <AdminMessages conversationId={conversationId ?? ""} /> */}
              <AdminMessages />
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
                              placeholder="Type a message..."
                              className="flex w-full rounded-xl border-0 bg-transparent text-sm text-white"
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      );
                    }}
                  />
                  {/* <Smile className='text-gray-500 text-xs font-light antialiased w-5 h-5'/>
                <Mic className='text-gray-500 text-xs font-light antialiased w-5 h-5' /> */}
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
              {sender?.name ?? "Tramona Host"}
            </p>
            <Button asChild className="absolute right-3 top-2 bg-inherit p-0">
              <Link href="/">
                <X className="text-white" />
              </Link>
            </Button>
          </div>
          <AdminMessages />
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
                          placeholder="Type a message..."
                          className="flex w-full rounded-xl border-0 bg-transparent text-sm text-white"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  );
                }}
              />
              {/* <Smile className='text-gray-500 text-xs font-light antialiased w-5 h-5'/>
            <Mic className='text-gray-500 text-xs font-light antialiased w-5 h-5' /> */}
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
      {/* </div> */}
    </>
  );
}

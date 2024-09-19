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
import { cn } from "@/utils/utils";

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

  useEffect(() => {
    if (!session && typeof window !== "undefined") {
      const storedToken =
        localStorage.getItem("tempToken") ?? crypto.randomUUID();
      setTempToken(storedToken);
      localStorage.setItem("tempToken", storedToken);

      if (!localStorage.getItem("tempUserCreated")) {
        void createTempUserForGuest({
          email: "temp_user@gmail.com",
          isBurner: true,
          sessionToken: storedToken,
        }).then(() => {
          localStorage.setItem("tempUserCreated", "true");
        });
      }
    }
  }, [createTempUserForGuest, session]);

  useEffect(() => {
    if (conversationIdAndTempUserId?.conversationId) {
      console.log(
        "conversationId: ",
        conversationIdAndTempUserId.conversationId,
      );
      setConversationId(conversationIdAndTempUserId.conversationId);
    }
  }, [conversationIdAndTempUserId]);

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
      // await sendChatboxSlackMessage({
      //   message: newMessage.message,
      //   conversationId: conversationId ?? "",
      //   senderId: newMessage.userId,
      // });
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
      // await sendChatboxSlackMessage({
      //   message: newMessage.message,
      //   conversationId: conversationId ?? "",
      //   senderId: newMessage.userId,
      // });
    }
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  function ChatboxContent({ isPopover }: { isPopover?: boolean }) {
    return (
      <div>
        <div className="flex flex-col">
          <div className="flex h-[7rem] w-full flex-col items-center justify-start bg-[#1A1A1A] p-4 text-base font-bold text-white">
            <UserAvatar image={concierge.image} />
            <p className="pt-1 text-xs font-light text-muted antialiased">
              Tramona Concierge
            </p>
            <p className="flex-1 px-2 text-sm font-medium antialiased">
              {concierge.name}
            </p>
          </div>
          <PopoverClose>
            <X className="fixed left-5 top-4 text-white" />
          </PopoverClose>
          <ListMessagesWithAdmin
            conversationId={conversationId}
            tempUserId={conversationIdAndTempUserId?.tempUserId ?? ""}
          />
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
    );
  }

  return (
    <div className="fixed bottom-10 right-4 z-50">
      <Popover>
        <PopoverTrigger asChild>
          <Button className="w-18 h-18 m-4 rounded-full border p-4">
            <MessageCircleMore />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="mx-8 grid h-[35rem] w-[21rem] grid-rows-1 rounded-xl border border-gray-800 bg-black p-0">
          <div className="flex flex-col">
            <div className="flex h-[7rem] w-full flex-col items-center justify-start bg-[#1A1A1A] p-4 text-base font-bold text-white">
              <UserAvatar image={session?.user.image} />
              <p className="pt-1 text-xs font-light text-muted-foreground antialiased">
                Tramona Host
              </p>
              <p className="flex-1 px-2 text-sm font-medium antialiased">
                Hostname
              </p>
              <PopoverClose>
                <X className="fixed left-12 top-4 text-white" />
              </PopoverClose>
            </div>
            {/* {!session ?? 
              <AdminMessages conversationId={conversationId} />

            } */}
            {/* <AdminMessages conversationId={conversationId ?? ""} /> */}
            <ListMessagesWithAdmin
              conversationId={conversationId}
              tempUserId={conversationIdAndTempUserId?.tempUserId ?? ""}
            />
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
        </PopoverContent>
      </Popover>
    </div>
  );
}

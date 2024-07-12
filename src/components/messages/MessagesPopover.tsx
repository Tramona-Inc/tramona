import {Popover, PopoverContent, PopoverTrigger} 
from '@/components/ui/popover'
import supabase from "@/utils/supabase-client";
import { Button } from '../ui/button'
import UserAvatar from '../_common/UserAvatar'
import { Form, FormControl, FormField, FormItem } from '../ui/form'
import { type ChatMessageType, GuestMessage, useMessage } from "@/utils/store/messages";
import { type MessageDbType } from '@/types/supabase.message';
import { useConversation } from '@/utils/store/conversations';
import { Input } from '../ui/input'
import {MessageCircleMore, Mic, ArrowUp, SendHorizonal, Smile, X} from 'lucide-react'
import { Session } from 'next-auth';
import { useForm } from "react-hook-form";
import { useEffect, useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PopoverClose } from '@radix-ui/react-popover'
import { api } from '@/utils/api'
import { nanoid } from "nanoid";
import { errorToast } from "@/utils/toasts";
import AdminMessages from './AdminMessages';
import { GuestMessageType } from '@/server/db/schema';
// import { createConversationWithAdmin } from '@/server/api/routers/messagesRouter';

let tempToken: string;

export default function MessagesPopover({session}: {
    session: Session | null,
}) {

  const {mutateAsync: createConversation} = api.messages.createConversationWithAdmin.useMutation();

  const {data: conversationId} = api.messages.getConversationsWithAdmin.useQuery({
   uniqueId: session?.user.id ?? "",
   session: session ? true : false })

  //  const { fetchInitialMessages } = useMessage()
  // void fetchInitialMessages(conversationId ?? "")
  
  const addMessageToConversation = useMessage( 
    (state) => state.addMessageToConversation
  )
  
  const optimisticIds = useMessage((state) => state.optimisticIds);
  
  
  const setConversationToTop = useConversation(
    (state) => state.setConversationToTop,
  );
  
  const removeMessageFromConversation = useMessage(
    (state) => state.removeMessageFromConversation,
  );

  const { fetchInitialMessages, fetchMessagesForGuest } = useMessage()
  if(!session) {
    void fetchMessagesForGuest(conversationId ?? "")
  }
  void fetchInitialMessages(conversationId ?? "")
  const { conversations } = useMessage()

  const messages = conversationId 
    ? conversations[conversationId]?.messages ?? []
    : [];

  
  const formSchema = z.object({
        message: z.string(),
  })
  
  if (!session && typeof window !== "undefined") {
    tempToken = localStorage.getItem("tempToken") ?? "";
    if (!tempToken) {
      tempToken = crypto.randomUUID();
      localStorage.setItem("tempToken", tempToken);
    }
  }

  const currentConversationId = useMessage(
    (state) => state.currentConversationId
  )
  // const {data: conversation_id} = api.messages.getConversationsWithAdmin.useQuery({uniqueId: temporary_token});
  
  const handleOnSend = async (values: z.infer<typeof formSchema>) => {

      //create conversation id if it doesnot exist
      const conversationId = await createConversation({
        uniqueId: session?.user.id ??  tempToken ?? "",
        session: session ? true : false,
      });
      console.log(conversationId)

      if(!session){
        const newMessage: GuestMessage = {
          id: nanoid(),
          createdAt: new Date().toISOString().slice(0,-1),
          conversationId: conversationId ?? "",
          userToken: tempToken,
          message: values.message,
          read: false,
          isEdit: false,
        };

        const newMessageToDb = {
          id: newMessage.id,
          conversation_id: newMessage.conversationId,
          user_token: newMessage.userToken,
          message: newMessage.message,
          read: newMessage.read,
          is_edit: newMessage.isEdit,
          created_at: newMessage.createdAt,
        }

        addMessageToConversation(conversationId ?? "", newMessage)
        setConversationToTop(conversationId ?? "", newMessage)
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
      }
      else{
        const newMessage: ChatMessageType = {
          id: nanoid(),
          createdAt: new Date().toISOString().slice(0, -1),
          conversationId: conversationId ?? "",
          userId: session?.user.id ?? "", //user is logged in
          // userToken: tempToken, //user has not logged in
          message: values.message,
          read: false,
          isEdit: false,
        };
  
        const newMessageToDb = {
          id: newMessage.id,
          conversation_id: conversationId ?? "",
          user_id: newMessage.userId,
          message: newMessage.message,
          // userToken: newMessage.userToken,
          read: newMessage.read,
          is_edit: newMessage.isEdit,
          created_at: new Date().toISOString(),
        };
  
        setConversationToTop(conversationId ?? "", newMessage);
        addMessageToConversation(conversationId ?? "", newMessage)
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

    }
      
      const handlePostgresChange = async (payload: { new: MessageDbType }) => {

        if (!optimisticIds.includes(payload.new.id)) {
          const { error } = await supabase
            .from("user")
            .select("name, email, image")
            .eq("id", payload.new.user_id ?? "")
            .single();
          if (error) {
            errorToast();
          } else {
            const newMessage: (ChatMessageType | GuestMessage) = {
              id: payload.new.id,
              conversationId: payload.new.conversation_id,
              userId: payload.new.user_id ?? "",
              message: payload.new.message,
              isEdit: payload.new.is_edit,
              createdAt: payload.new.created_at,
              read: payload.new.read,
            };
          }
        }        
      }
    
      useEffect(() => {
        const channel = supabase
          .channel(`${currentConversationId}`)
          .on(
            "postgres_changes",
            {
              event: "INSERT",
              schema: "public",
              table: "messages",
            },
            (payload: { new: MessageDbType }) => void handlePostgresChange(payload),
          )
          .subscribe();
    
        return () => {
          void channel.unsubscribe();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [currentConversationId, messages]);

      

    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema)
    })
      const today = new Date();
      let hours = today.getHours().toString();
      let minutes = today.getMinutes().toString();
      hours = hours.length === 1 ? "0" + hours : hours;
      minutes = minutes.length === 1 ? "0" + minutes : minutes;
      return (
      <div className="fixed bottom-10 right-4 z-50">
            <Popover>
            <PopoverTrigger asChild>
                <Button className="border rounded-full p-4 w-18 h-18 m-4">
                    <MessageCircleMore />
                </Button>
              </PopoverTrigger>  
              <PopoverContent className="grid grid-rows-1 p-0 w-[21rem] h-[35rem] mx-8 bg-black border rounded-xl border-gray-800">
              <div className="flex flex-col">
              <div className="flex flex-col w-full h-[7rem] items-center justify-start p-4 text-base font-bold text-white bg-[#1A1A1A]">
                <UserAvatar image={session?.user.image}/>
                <p className='text-muted-foreground antialiased font-light text-xs pt-1'>Tramona Host</p>
                <p className='flex-1 px-2 antialiased text-sm font-medium'>Hostname</p>
              <PopoverClose>
                  <X className='fixed top-4 left-12 text-white'/>
              </PopoverClose>
              </div>
              {/* {!session ?? 
              <AdminMessages conversationId={conversationId} />

            } */}
              {/* <AdminMessages conversationId={conversationId ?? ""} /> */}
              <AdminMessages />
              </div>
              <div className="flex flex-row gap-2 h-max items-center p-1 border border-gray-500 rounded-full mx-4 my-2">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleOnSend)} className='flex flex-row w-full'>
                <FormField
                control={form.control}
                name="message"
                render={({field}) => {
                  return (
                  <FormItem className='flex-1'>
                    <FormControl>
                      <Input
                      placeholder="Type a message..."
                      className="flex w-full rounded-xl border-0 bg-transparent text-sm text-white"
                      {...field}
                      />
                    </FormControl>
                  </FormItem>)
                }}
                />
              {/* <Smile className='text-gray-500 text-xs font-light antialiased w-5 h-5'/>
                <Mic className='text-gray-500 text-xs font-light antialiased w-5 h-5' /> */}
              <Button className='bg-[#0D4273] px-2 rounded-full' size="icon" type='submit'>
                <ArrowUp className='text-xs antialiased'/>
              </Button>
                </form>
              </Form>
              </div>
              </PopoverContent>            
            </Popover>
          </div>
)}

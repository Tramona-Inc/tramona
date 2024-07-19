import {Popover, PopoverContent, PopoverTrigger} 
from '@/components/ui/popover'
import supabase from "@/utils/supabase-client";
import { Button } from '../ui/button'
import UserAvatar from '../_common/UserAvatar'
import { Form, FormControl, FormField, FormItem } from '../ui/form'
import { type ChatMessageType, type GuestMessage, useMessage } from "@/utils/store/messages";
import { GuestMessageType, type MessageDbType } from '@/types/supabase.message';
import { useConversation } from '@/utils/store/conversations';
import { Input } from '../ui/input'
import {MessageCircleMore, ArrowUp, X} from 'lucide-react'
import { type Session } from 'next-auth';
import { useForm } from "react-hook-form";
import { useEffect } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PopoverClose } from '@radix-ui/react-popover'
import { api } from '@/utils/api'
import { nanoid } from "nanoid";
import { errorToast } from "@/utils/toasts";
import AdminMessages from './AdminMessages';
import { useMediaQuery } from "@/components/_utils/useMediaQuery";

// import { createConversationWithAdmin } from '@/server/api/routers/messagesRouter';

let tempToken: string;

export default function MessagesPopover({session}: {
    session: Session | null,
}) {

  const {mutateAsync: createConversation} = api.messages.createConversationWithAdmin.useMutation();

  if (!session && typeof window !== "undefined") {
    tempToken = localStorage.getItem("tempToken") ?? "";
    if (!tempToken) {
      tempToken = crypto.randomUUID();
      localStorage.setItem("tempToken", tempToken);
    }
  }

  const {data: conversationId} = api.messages.getConversationsWithAdmin.useQuery({
    uniqueId: session?.user.id ?? tempToken ?? "",
    session: session ? true : false,
  })

  //  const { fetchInitialMessages } = useMessage()
  // void fetchInitialMessages(conversationId ?? "")
  const isMobile = useMediaQuery("(max-width:648px)")
  const addMessageToConversation = useMessage( 
    (state) => state.addMessageToConversation
  )
  const addMessageToAdminConversation = useMessage( 
    (state) => state.addMessageToAdminConversation
  )
  
  const optimisticIds = useMessage((state) => state.optimisticIds);
  const setOptimisticIds = useMessage((state) => state.setOptimisticIds);
  
  
  const removeMessageFromConversation = useMessage(
    (state) => state.removeMessageFromConversation,
  );

  const { conversations } = useMessage();
  const { adminConversations } = useMessage()

  const { fetchInitialMessages, fetchMessagesForGuest } = useMessage()

  if(!session) {
    void fetchMessagesForGuest(conversationId ?? "")
  }
  void fetchInitialMessages(conversationId ?? "")

  const messages = conversationId ?
    conversations[conversationId]?.messages ?? [] : [];

  const adminMessages = conversationId 
    ? adminConversations[conversationId]?.messages ?? []
    : [];
  
  const adminDetails: ChatMessageType & GuestMessage | null = session ? messages.find((message) => "userId" in message && message.userId !== session.user.id) :  adminMessages.find((message) => "userToken" in message && message.userToken !== tempToken)
  // console.log(adminDetails);
  const { data: sender } = session ? 
  api.messages.fetchAdminDetails.useQuery({adminId: adminDetails?.userId ?? ""}) :
  api.messages.fetchAdminDetails.useQuery({adminId: adminDetails?.userToken  ?? ""})
  // console.log(sender?.name);
  const formSchema = z.object({
        message: z.string(),
  })

  
  // const {data: conversation_id} = api.messages.getConversationsWithAdmin.useQuery({uniqueId: temporary_token});
  
  const handleOnSend = async (values: z.infer<typeof formSchema>) => {

      //create conversation id if it doesnot exist
      const conversationId = await createConversation({
        uniqueId: session?.user.id ??  tempToken ?? "",
        session: session ? true : false,
      });
      console.log(conversationId)

      if(!session){
        const newMessage: ChatMessageType & GuestMessage = {
          id: nanoid(),
          createdAt: new Date().toISOString().slice(0,-1),
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
        }

        addMessageToAdminConversation(conversationId ?? "", newMessage)
        setOptimisticIds(newMessage.id)
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
      }
      else{
        
        const newMessage: ChatMessageType & GuestMessage = {
          id: nanoid(),
          createdAt: new Date().toISOString().slice(0, -1),
          conversationId: conversationId ?? "",
          userId: session?.user.id ?? "", //user is logged in
          userToken: "", //user has not logged in
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
        addMessageToConversation(conversationId ?? "", newMessage)
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
    }
  //   console.log(messages)
  useEffect(() => {
    console.log("handling postgres change for logged in user");
    console.log(conversationId);
    const channel = supabase
      .channel(`${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        (payload: { new: MessageDbType}) => {
          console.log(payload)
          void handlePostgresChange(payload)},
      )
      .subscribe();
    console.log("going or no?");
    return () => {
      console.log("unsubscibing from channel");
      void channel.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId, messages]);
  
  const handlePostgresChange = async (payload: { new: MessageDbType }) => {
    console.log("coming to handlePostgresChange")
    if(optimisticIds.includes(payload.new.id)) {
        const newMessage: ChatMessageType & GuestMessage = {
          id: payload.new.id,
          conversationId: payload.new.conversation_id,
          userId: payload.new.user_id ?? "",
          // userToken:payload.new.user_token,
          message: payload.new.message,
          isEdit: payload.new.is_edit,
          createdAt: payload.new.created_at,
          read: payload.new.read,
          userToken: "",
        };
        addMessageToConversation(payload.new.conversation_id, newMessage)
        setOptimisticIds(newMessage.id)      
  }
  }
  


    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema)
    })
      const today = new Date();
      let hours = today.getHours().toString();
      let minutes = today.getMinutes().toString();
      hours = hours.length === 1 ? "0" + hours : hours;
      minutes = minutes.length === 1 ? "0" + minutes : minutes;
      return (
      <>
        {!isMobile ? 
      <div className="fixed bottom-10 right-4 z-50">
            <Popover>
            <PopoverTrigger asChild>
              {session?.user.role !== "host" && session?.user.role !== "admin" ? 
                <Button className="border rounded-full p-4 w-18 h-18 m-4">
                    <MessageCircleMore />
                </Button>
                :
                <></>
              }
              </PopoverTrigger>  
              <PopoverContent className="grid grid-rows-1 p-0 w-[21rem] h-[35rem] mx-8 bg-black border rounded-xl border-gray-800">
              <div className="flex flex-col">
              <div className="flex flex-col w-full h-[7rem] items-center justify-start p-4 text-base font-bold text-white bg-[#1A1A1A]">
                <UserAvatar image={session?.user.image ?? sender?.image}/>
                <p className='text-muted-foreground antialiased font-light text-xs pt-1'>Concierge</p>
                <p className='flex-1 px-2 antialiased text-sm font-medium'>{sender?.name}</p>
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
          :
          <>
          <div className='grid grid-rows-1 p-0 w-screen h-screen-minus-header-n-footer bg-black border  border-gray-800 sm:hidden'>
          <div className="flex flex-col">
            <div className="flex flex-col w-full h-[7rem] items-center justify-start p-4 text-base font-bold text-white bg-[#1A1A1A]">
                <UserAvatar image={session?.user.image}/>
                <p className='text-muted-foreground antialiased font-light text-xs pt-1'>Concierge</p>
                <p className='flex-1 px-2 antialiased text-sm font-medium'>Tramona host</p>
              </div>
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
          </div>
          </>
        }
        </>
)}

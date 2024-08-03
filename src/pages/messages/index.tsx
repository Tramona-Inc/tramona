import DashboardLayout from "@/components/_common/Layout/DashboardLayout";
import MessagesContent from "@/components/messages/MessagesContent";
import MessagesSidebar from "@/components/messages/MessagesSidebar";
import {
  type AdminConversation,
  useConversation,
  type Conversation,
} from "@/utils/store/conversations";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { api } from "@/utils/api";
// import { useMediaQuery } from "@/components/_utils/useMediaQuery";
import {cn} from '@/utils/utils';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
function MessageDisplay() {
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | AdminConversation | null>(null);

  const selectConversation = (conversation: Conversation | AdminConversation | null) => {
    setSelectedConversation(conversation);
  };

  // * Allows us to open message from url query
  const [isViewed, setIsViewd] = useState(false);
  const conversations = useConversation((state) => state.conversationList);
  const adminConversation = useConversation((state) => state.adminConversationList)



  // console.log(conversations)
  // console.log(adminConversation)
  const { query } = useRouter();

  useEffect(() => {
    if (query.conversationId && conversations.length > 0) {
      const conversationIdToSelect = query.conversationId as string;
      const conversationToSelect = conversations.find(
        (conversation) => conversation.id === conversationIdToSelect,
      );

      conversationToSelect && setSelectedConversation(selectedConversation)

    //   if (
    //     conversationToSelect &&
    //     selectedConversation?.id !== conversationToSelect.id
    //   ) {
    //     setSelectedConversation(conversationToSelect);
    //   }
      console.log("getting from query", selectedConversation)
      setIsViewd(true);
    }
  }, [conversations, isViewed, query.conversationId, selectedConversation?.id, adminConversation]);

  return (
    <div className="flex h-screen-minus-header-n-footer divide-x">
      <div
        className={cn(
          "w-full bg-white md:w-96",
          selectedConversation && "hidden md:block",
        )}
      >
        <MessagesSidebar
          selectedConversation={selectedConversation}
          setSelected={selectConversation}
        />
      </div>
      <div
        className={cn(
          "flex h-full flex-1 items-center justify-center",
          !selectedConversation && "hidden md:flex",
        )}
      >
        <MessagesContent
          selectedConversation={selectedConversation}
          setSelected={selectConversation}
        />
      </div>
    </div>
  );
}

export default function MessagePage() {
  const { data: session } = useSession({ required: true });

  const { data: totalUnreadMessages } =
    api.messages.getNumUnreadMessages.useQuery();

    // const isMobile = useMediaQuery("(max-width:648px)")

    const formSchema = z.object({
      message: z.string(),
    })
    
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema)
    })

  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      void Notification.requestPermission();
    }
  }, []);

  return (
    <>
    {/* {!isMobile
    ? */}
      <div className="hidden sm:block">
      <Head>
        <title>
          {totalUnreadMessages && totalUnreadMessages > 0
            ? `(${totalUnreadMessages})`
            : ""}{" "}
          Messages | Tramona
        </title>
      </Head>
      <DashboardLayout type={session?.user.role ?? "guest"}>
        <MessageDisplay />
      </DashboardLayout>
      </div>
      <div className="sm:hidden">
      {/* <Head>
      <title>
        {totalUnreadMessages && totalUnreadMessages > 0
          ? `(${totalUnreadMessages})`
          : ""}{" "}
        Messages | Tramona
      </title>
    </Head>  */}
    {/* <DashboardLayout type={session?.user.role ?? "guest"}>
      <div className="grid grid-rows-1 p-0 w-screen h-screen-minus-header-n-footer bg-black border  border-gray-800">
      <div className="flex flex-col">
      <div className="flex flex-col w-full h-[7rem] items-center justify-start p-4 text-base font-bold text-white bg-[#1A1A1A]">
                <UserAvatar image={session?.user.image}/>
                <p className='text-muted-foreground antialiased font-light text-xs pt-1'>Tramona Host</p>
                <p className='flex-1 px-2 antialiased text-sm font-medium'>Hostname</p>
                <AdminMessages />
              </div>
              </div>
              </div>
              <div className="flex flex-row gap-2 h-max items-center p-1 border border-gray-500 rounded-full mx-4 my-2">
              <Form {...form}>
                <FormField
                control={form.control}
                name="message"
                render={({field}) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input
                      placeholder="Enter your message..."
                      className="rounded-xl border-0 bg-transparent text-sm text-white"
                      {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
                ></FormField>
              </Form>
              <Smile className='text-gray-500 text-xs font-light antialiased w-5 h-5'/>
                <Mic className='text-gray-500 text-xs font-light antialiased w-5 h-5' />
              <Button className='bg-[#0D4273] px-2 rounded-full '>
                <ArrowUp className='text-xs antialiased'/>
              </Button>
              </div>
      </DashboardLayout> */}
      </div>
    </>
  );
}

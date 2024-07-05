import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover'
import { Button } from '../ui/button'
import UserAvatar from '../_common/UserAvatar'
import { Form, FormControl, FormField, FormItem } from '../ui/form'
import { Input } from '../ui/input'
import {MessageCircleMore, Mic, ArrowUp, SendHorizonal, Smile, X} from 'lucide-react'
import { Session } from 'next-auth';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PopoverClose } from '@radix-ui/react-popover'


export default function MessagesPopover({session}: {
    session: Session | null,
}) {
    const formSchema = z.object({
        message: z.string(),
      })
      
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
              <div className="grow grid grid-rows-1">
                <div className="flex place-items-end m-1 p-1">
                  {/* <UserAvatar className="my-2" image={session?.user.image}/> */}
                  <p className="px-2 py-2 border-none rounded-r-xl rounded-tl-xl bg-[#2E2E2E] text-sm text-white text-background max-w-[15rem] h-max antialiased">
                    Ask Your Question
                  </p>
                </div>
              <div className="flex flex-row-reverse m-1 p-1">
                {/* <UserAvatar image={session?.user.image}/> */}
              <p className="px-2 py-2 border-none bg-[#1A84E5] text-sm text-white rounded-l-xl rounded-tr-xl max-w-[15rem] h-max antialiased">
                  Hey! how are you doing? I had few questions
                  {/* <span className='text-xs pl-4 text-right'>{`${hours}:${minutes}`}</span> */}
                </p>
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
              </PopoverContent>            
            </Popover>
          </div>
)}
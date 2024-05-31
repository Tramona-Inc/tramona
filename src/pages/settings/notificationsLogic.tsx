import SettingsLayout from "@/components/_common/Layout/SettingsLayout";
import { Separator } from '@/components/ui/separator';
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormField,
  FormControl,
  FormLabel,
  FormDescription,
  FormItem
} from '@/components/ui/form'
import { z } from 'zod';
import { api, type RouterOutputs  } from "@/utils/api";
import { useSession } from "next-auth/react";
import { EffectCallback, useEffect, useState } from "react";

const notificationType = ["Email", "Text"] as const
const commonNotifications = [
  {
    name:"responseByHost",
    label: "When a host responds to your offer",
    subLabel: "Be up to date when a host responds to your offer you sent on a property. Remember you only have 24h to respond to host's counter offer before ot expires"    
  },
  {
    name:"tripUpdates",
    label: "Important Trip Updates",
    subLabel: "Notifications for booking confirmation, check-in information, trip reminders, cancellations"
  },
] as const

const emailNotifications = [
  {
    name:"mandatory",
    label: "Mandatory emails",
    subLabel: "Get emails related to Email verification, password reset, booking confirmation/cancellation, pre-arrival info, post-stay ratings, booking modification "
  },
  {
    name:"offerByHost",
    label: "When you have a new offer for a request",
    subLabel: "Get email alerts when a host sends you an offer for a request."
  },
  ...commonNotifications,
  {
    name:"msgByHost",
    label: 'Messages from a host',
    subLabel: "Be notified when a host sends you a message."
  }
] as const

const textNotifications = [
  {
    name: "mandatory",
    label: "Mandatory Notifications",
    subLabel: "Notifications for OTP, offer acceptance, counter offer, booking confirmation/cancellation"
  },
  {
    name:"offerByHost",
    label: "When you have a new offer for a request",
    subLabel: "Get text alerts when a host sends you an offer for a request."
  },
  ...commonNotifications,
  {
    name:"expirationMsg",
    label: "Three hours before a bid expires",
    subLabel: "Be notified three hours before an offer or counter offer expires. You are only notified when its your turn to make an offer"
  }
] as const



export type notificationSettingOutput =  RouterOutputs["users"]["getNotificationSetting"]

export default function Notifications() {

  const {data: session} = useSession({required: true})

  const FormSchema = z.object({
    offerByHostEmail: z.boolean(),
    responseByHostEmail: z.boolean(),
    tripUpdatesEmail: z.boolean(),
    msgByHostEmail: z.boolean(),
    mandatoryText: z.boolean().default(true),
    offerByHostText: z.boolean(),
    responseByHostText: z.boolean(),
    tripUpdatesText: z.boolean(),
    expirationMsgText: z.boolean(),
    mandatoryEmail: z.boolean().default(true),
  })

  const [notificationObj, setNotificationObj] = useState<null | notificationSettingOutput> ()


    type FormValues = z.infer<typeof FormSchema> 

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
  })

  const { data } = api.users.getNotificationSetting.useQuery()

  // console.log(data)

    useEffect(()=>{ 
      setNotificationObj(data)
    }, [data])

  
  const { mutateAsync: updateNotificationSetting } = api.users.updateNotificationSetting.useMutation()

  const handleOnChange = async (name: string, value: boolean) => {
    console.log(name)
    console.log(value)
    if(notificationObj){
      notificationObj[name as keyof FormValues] = value

      // setNotificationObj(notificationObj)

      console.log(notificationObj)
      await updateNotificationSetting(notificationObj)
    }
  }
  
  
  

  return (
    <SettingsLayout>
      <div className="mx-auto my-8 max-w-4xl">
        <div className="space-y-4 rounded-lg border bg-white p-4">
          <h1 className="text-lg font-bold">Notification Settings</h1>
          <p className = "text-sm text-muted-foreground">Select the kinds of notifications you want to recieve</p>

          <Separator />

          {notificationType.map((kind) => (
          <>
          {notificationObj && 
          <Form {...form}>
            <div className="flex flex-row w-full">
              <div className="flex-1 px-8">
                <h3 className="text-md font-bold">{kind} Notifications</h3>
                <p className="text-sm text-muted-foreground">
                  Get {kind.toLowerCase()}s to find out updates on your trips, requests, offers that you have sent and any responses you get from hosts.
                </p>
              </div>
              <ScrollArea className="h-[225px] w-[500px] rounded-md border p-4">
              <div className="flex-1 space-y-4">
            {kind === "Email" && emailNotifications.map((notification, index) => {
              console.log(notificationObj)
              return (
              <>
              <FormField control={form.control} name={`${notification.name}Email`} render={({field}) => (
                <FormItem className="flex flex-row space-y-2">
                  <div className="flex-1">
                  <FormLabel className="text-base text-foreground text-md font-bold">
                    {notification.label}
                  </FormLabel>
                  <FormDescription>
                    {notification.subLabel}
                  </FormDescription>
                  </div>
                  <FormControl>
                {notification.name === "mandatory" ? 
                <Switch 
                className='data-[state=checked]:bg-blue-500'
                defaultChecked={true}
                disabled={true}
                />
                :
                <Switch 
                className='data-[state=checked]:bg-blue-500'
                checked={notificationObj[field.name] == true ? true : false}
                onCheckedChange={(value) => handleOnChange(field.name, value)}/>
                }
                  </FormControl>
                </FormItem>
                )} ></FormField>

              </>
              )})}
            {kind === "Text" && textNotifications.map((notification, index) => (
              <>
                <FormField control={form.control} name={`${notification.name}Text`} render={({field}) => (
                  <FormItem className="flex flex-row space-y-2">
                    <div className="flex-1">
                    <FormLabel className="text-md text-foreground font-bold text-base">
                      <h3 className="text-md font-bold" key={index}>{notification.label}</h3>
                    </FormLabel>
                    <FormDescription>
                    {notification.subLabel}
                    </FormDescription>
                    </div>
                <FormControl>
                {notification.name === "mandatory" ? 
                <Switch 
                className='data-[state=checked]:bg-blue-500'
                defaultChecked={true}
                disabled={true}
                />
                :
                <Switch 
                className='data-[state=checked]:bg-blue-500'
                checked={notificationObj[field.name] == true ? true : false}
                onCheckedChange={(value) => handleOnChange(field.name, value)}/>
                }
                </FormControl>
                </FormItem>
                )} ></FormField>
              </>
            ))}
            </div>
            </ScrollArea>
        </div>
        {kind === "Email" && <Separator />}
      </Form>
      }
        </>   
        ))}

        </div>
      </div>
    </SettingsLayout>
  )
}
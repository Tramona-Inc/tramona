import SettingsLayout from "@/components/_common/Layout/SettingsLayout";
import { Separator } from '@/components/ui/separator';
import { Switch } from "@/components/ui/switch";


const notificationType = ["Email", "Text"]
const commonNotifications = [
  {
    label: "When a host responds to your offer",
    subLabel: "Be up to date when a host responds to your offer you sent on a property. Remember you only have 24h to respond to host's counter offer before ot expires"    
  },
  {
    label: "Important Trip Updates",
    subLabel: "Notifications for booking confirmation, check-in information, trip reminders, cancellations"
  },
]
const emailNotifications = [
  {
    label: "When you have a new offer for a request",
    subLabel: "Get email alerts when a host sends you an offer for a request."
  },
  ...commonNotifications,
  {
    label: 'Messages from a host',
    subLabel: "Be notified when a host sends you a message."
  }
]

const textNotifications = [
  {
    label: "When you have a new offer for a request",
    subLabel: "Get email alerts when a host sends you an offer for a request."
  },
  ...commonNotifications,
  {
    label: "Three hours before a bid expires",
    subLabel: "Be notified three hours before an offer or counter offer expires. You are only notified when its your turn to make an offer"
  }
]

export default function Notifications() {
  return (
    <SettingsLayout>
      <div className="mx-auto my-8 max-w-4xl">
        <div className="space-y-4 rounded-lg border bg-white p-4">
          <h1 className="text-lg font-bold">Notification Settings</h1>
          <p className = "text-sm text-muted-foreground">Select the kinds of notifications you want to recieve</p>
          <Separator />
          {notificationType.map((kind) => (
            <>
            <div className="flex flex-row w-full space-y-4">
              <div className="flex-1 px-8">
                <h3 className="text-md font-bold">{kind} Notifications</h3>
                <p className="text-sm text-muted-foreground">
                  Get {kind.toLowerCase()}s to find out updates on your trips, requests, offers that you have sent and any responses you get from hosts.
                </p>
              </div>
              <div className="flex-1 space-y-4">
            {kind === "Email" && emailNotifications.map((notification, index) => (
              <>
              <div className="flex flex-row space-y-2">
                <div className="flex-1">
                  <h3 className="text-md font-bold" key={index}>{notification.label}</h3>
                  <p className="text-sm text-muted-foreground">{notification.subLabel}</p>
                </div>
                <Switch className='data-[state=checked]:bg-blue-500'/>
              </div>
              </>
            ))}
            {kind === "Text" && textNotifications.map((notification, index) => (
              <>
              <div className="flex flex-row space-y-2">
                <div className="flex-1">
                  <h3 className="text-md font-bold" key={index}>{notification.label}</h3>
                  <p className="text-sm text-muted-foreground">{notification.subLabel}</p>
                </div>
                <Switch />
              </div>
              </>
            ))}
            </div>
        </div>
        {kind === "Email" && <Separator />}
        </>   
        ))}
        </div>
      </div>
    </SettingsLayout>
  );
}

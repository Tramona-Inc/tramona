import { Bell, CreditCardIcon, UserIcon } from "lucide-react";

export const settingsLinks = [
  {
    href: "/settings/personal-information",
    label: "Personal information",
    icon: UserIcon,
  },
  {
    href: "/settings/payment-information",
    label: "Payment information",
    icon: CreditCardIcon,
  },
  {
    href: "/settings/notifications",
    label: "Notifications",
    icon: Bell,
  },
];

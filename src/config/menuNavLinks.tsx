import { UserRound, HandCoins, CircleHelp, MailQuestion, Bug} from 'lucide-react';

export const guestMenuNavLinks = [
  { href: "/profile", name: "Your Profile", icon: <UserRound/> },
  { href: "/refer", name: "Refer and earn", icon: <HandCoins/> },
  { href: "/faq", name: "FAQ", icon: <CircleHelp/> },
  { href: "/support", name: "Help center", icon: <MailQuestion/>},
  { href: "/support", name: "Report a bug", icon: <Bug/>},
];

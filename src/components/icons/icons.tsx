import type { LucideIcon, LucideProps } from 'lucide-react';
import {
  ArrowRight,
  Twitter,
  Github,
  Mail,
  Instagram,
  Linkedin,
  Clipboard,
  Loader2,
  ChevronLeft,
  ChevronLeftCircle,
  ChevronRightCircle,
  Radio,
  LayoutDashboard,
  Tags,
  List,
  MessageSquareIcon,
  Layers3,
  Settings,
  LogOut,
  HelpCircle,
  ChevronsUpDownIcon,
  ChevronDown,
  Hourglass,
  Check,
  Lock,
  ArrowDown,
  ArrowUp,
  EyeOff,
  MoreHorizontal,
} from 'lucide-react';

export type Icon = LucideIcon;

type IconProps = React.HTMLAttributes<SVGElement>;

export const Icons = {
  dotHorizontal: MoreHorizontal,
  eyeOff: EyeOff,
  arrowUp: ArrowUp,
  arrowDown: ArrowDown,
  lock: Lock,
  check: Check,
  inProgress: Hourglass,
  chevronDown: ChevronDown,
  sort: ChevronsUpDownIcon,
  question: HelpCircle,
  logout: LogOut,
  settings: Settings,
  layer: Layers3,
  messageSquare: MessageSquareIcon,
  list: List,
  tags: Tags,
  dashboard: LayoutDashboard,
  arrowRight: ArrowRight,
  clipboard: Clipboard,
  twitter: Twitter,
  github: Github,
  linkedin: Linkedin,
  mail: Mail,
  instagram: Instagram,
  chevronLeft: ChevronLeft,
  chevronCircleLeft: ChevronLeftCircle,
  chevronCircleRight: ChevronRightCircle,
  radio: Radio,
  message: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      data-slot="icon"
      className="h-6 w-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z"
      />
    </svg>
  ),
  comment: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      data-slot="icon"
      className="h-6 w-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 0 1 1.037-.443 48.282 48.282 0 0 0 5.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
      />
    </svg>
  ),
  heart: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      data-slot="icon"
      className="h-6 w-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
      />
    </svg>
  ),
  bookmark: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      data-slot="icon"
      className="h-6 w-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
      />
    </svg>
  ),
  share: ({ ...props }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      data-slot="icon"
      className="h-6 w-6"
      transform="rotate(-45)"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
      />
    </svg>
  ),
  loading: () => (
    <div className="animate-spin">
      <Loader2 />
    </div>
  ),
  star: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      data-slot="icon"
      className="h-4 w-4"
      color="black"
    >
      <path
        fillRule="evenodd"
        d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
        clipRule="evenodd"
      />
    </svg>
  ),
  logo: ({ ...props }: LucideProps) => (
    <svg width="32" height="32" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M29.5407 46.1705V10.1004C29.5407 9.08113 28.1944 8.71512 27.6784 9.59406L6.5005 45.6642C6.1091 46.3308 6.5898 47.1705 7.36285 47.1705H28.5407C29.093 47.1705 29.5407 46.7228 29.5407 46.1705Z"
        fill="white"
      />
      <path
        d="M34.2342 46.1705V6.83918C34.2342 5.80866 35.6044 5.45177 36.1072 6.35134L58.0879 45.6826C58.4604 46.3492 57.9785 47.1705 57.2149 47.1705H35.2342C34.6819 47.1705 34.2342 46.7228 34.2342 46.1705Z"
        fill="white"
      />
      <path
        d="M57.4685 51.0679H6.22076C5.5894 51.0679 5.11321 51.6483 5.30675 52.2493C7.07775 57.7484 12.7205 59.4649 15.4888 59.6231H48.2228C54.5738 59.116 57.4367 54.9914 58.3593 52.2095C58.5537 51.6232 58.0862 51.0679 57.4685 51.0679Z"
        fill="white"
      />
      <path
        d="M29.5407 46.1705V10.1004C29.5407 9.08113 28.1944 8.71512 27.6784 9.59406L6.5005 45.6642C6.1091 46.3308 6.5898 47.1705 7.36285 47.1705H28.5407C29.093 47.1705 29.5407 46.7228 29.5407 46.1705Z"
        stroke="white"
      />
      <path
        d="M34.2342 46.1705V6.83918C34.2342 5.80866 35.6044 5.45177 36.1072 6.35134L58.0879 45.6826C58.4604 46.3492 57.9785 47.1705 57.2149 47.1705H35.2342C34.6819 47.1705 34.2342 46.7228 34.2342 46.1705Z"
        stroke="white"
      />
      <path
        d="M57.4685 51.0679H6.22076C5.5894 51.0679 5.11321 51.6483 5.30675 52.2493C7.07775 57.7484 12.7205 59.4649 15.4888 59.6231H48.2228C54.5738 59.116 57.4367 54.9914 58.3593 52.2095C58.5537 51.6232 58.0862 51.0679 57.4685 51.0679Z"
        stroke="white"
      />
    </svg>
  ),
  menubar: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className="h-6 w-6"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
    </svg>
  ),
};

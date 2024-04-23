import type { LucideIcon, LucideProps } from "lucide-react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronLeftCircle,
  ChevronRightCircle,
  ChevronsUpDownIcon,
  Clipboard,
  EyeOff,
  FileSliders,
  Github,
  HelpCircle,
  Hourglass,
  Instagram,
  Layers3,
  LayoutDashboard,
  Linkedin,
  List,
  Loader2,
  Lock,
  LogOut,
  Mail,
  MessageSquareIcon,
  MoreHorizontal,
  Radio,
  Settings,
  Tags,
  Twitter,
  X,
} from "lucide-react";

export type Icon = LucideIcon;

// type IconProps = React.HTMLAttributes<SVGElement>;

export const Icons = {
  close: X,
  spinner: Loader2,
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
  adminTab: FileSliders,
  search: () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9.66928 19.4597C14.4561 19.4597 18.3366 15.5792 18.3366 10.7923C18.3366 6.0055 14.4561 2.125 9.66928 2.125C4.88245 2.125 1.00195 6.0055 1.00195 10.7923C1.00195 15.5792 4.88245 19.4597 9.66928 19.4597Z"
        stroke="#2F5BF6"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M23 21.875L17 15.875"
        stroke="#2F5BF6"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  request: () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clip-path="url(#clip0_4449_12040)">
        <path
          d="M3.0464 8.27737C2.88589 7.55408 2.91054 6.80197 3.11805 6.09075C3.32556 5.37954 3.70922 4.73225 4.23345 4.20891C4.75768 3.68557 5.40552 3.30311 6.11688 3.09701C6.82825 2.89091 7.58012 2.86783 8.30278 3.02991C8.70054 2.40759 9.2485 1.89545 9.89614 1.5407C10.5438 1.18595 11.2703 1 12.0086 1C12.747 1 13.4735 1.18595 14.1211 1.5407C14.7688 1.89545 15.3167 2.40759 15.7145 3.02991C16.4383 2.86712 17.1914 2.8901 17.9039 3.0967C18.6164 3.30331 19.2651 3.68682 19.7897 4.21158C20.3142 4.73634 20.6976 5.3853 20.9041 6.09808C21.1106 6.81086 21.1336 7.56432 20.9709 8.28837C21.593 8.68628 22.1049 9.23445 22.4595 9.88235C22.8141 10.5302 23 11.257 23 11.9957C23 12.7343 22.8141 13.4611 22.4595 14.109C22.1049 14.7569 21.593 15.3051 20.9709 15.703C21.1329 16.426 21.1098 17.1781 20.9038 17.8898C20.6978 18.6014 20.3155 19.2495 19.7924 19.7739C19.2692 20.2984 18.6222 20.6822 17.9113 20.8898C17.2003 21.0974 16.4485 21.122 15.7255 20.9615C15.3283 21.5862 14.7799 22.1005 14.1311 22.4568C13.4824 22.8132 12.7542 23 12.0141 23C11.274 23 10.5459 22.8132 9.89715 22.4568C9.24841 22.1005 8.70002 21.5862 8.30278 20.9615C7.58012 21.1235 6.82825 21.1005 6.11688 20.8944C5.40552 20.6883 4.75768 20.3058 4.23345 19.7825C3.70922 19.2591 3.32556 18.6118 3.11805 17.9006C2.91054 17.1894 2.88589 16.4373 3.0464 15.714C2.41954 15.3171 1.90321 14.7681 1.54541 14.118C1.18762 13.4679 1 12.7378 1 11.9957C1 11.2536 1.18762 10.5235 1.54541 9.87337C1.90321 9.22326 2.41954 8.67423 3.0464 8.27737Z"
          stroke="#5B616D"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M15 9L9 15"
          stroke="#5B616D"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M9 9H9.01"
          stroke="#5B616D"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M15 15H15.01"
          stroke="#5B616D"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_4449_12040">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  ),
  message: () => (
    <svg
      width="26"
      height="24"
      viewBox="0 0 26 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5.03565 17.6361L7.25116 21.4774C7.27444 21.5123 7.32101 21.5123 7.34429 21.4774L9.5598 17.6361H22.6007C23.5746 17.6361 24.3622 16.8484 24.3622 15.8746V4.26154C24.3622 3.28764 23.5746 2.5 22.6007 2.5H3.40215C2.42825 2.5 1.63672 3.28764 1.63672 4.26154V15.8746C1.63672 16.8484 2.42825 17.6361 3.40215 17.6361H5.03565Z"
        stroke="#5B616D"
        strokeWidth="2"
        strokeMiterlimit="10"
      />
      <path
        d="M7.89135 11.4038C8.63065 11.4038 9.22997 10.8045 9.22997 10.0652C9.22997 9.32589 8.63065 8.72656 7.89135 8.72656C7.15206 8.72656 6.55273 9.32589 6.55273 10.0652C6.55273 10.8045 7.15206 11.4038 7.89135 11.4038Z"
        fill="#5B616D"
      />
      <path
        d="M13.196 11.4038C13.9353 11.4038 14.5347 10.8045 14.5347 10.0652C14.5347 9.32589 13.9353 8.72656 13.196 8.72656C12.4567 8.72656 11.8574 9.32589 11.8574 10.0652C11.8574 10.8045 12.4567 11.4038 13.196 11.4038Z"
        fill="#5B616D"
      />
      <path
        d="M18.4988 11.4038C19.2381 11.4038 19.8374 10.8045 19.8374 10.0652C19.8374 9.32589 19.2381 8.72656 18.4988 8.72656C17.7595 8.72656 17.1602 9.32589 17.1602 10.0652C17.1602 10.8045 17.7595 11.4038 18.4988 11.4038Z"
        fill="#5B616D"
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
  share: () => (
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
    <svg
      width="32"
      height="32"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
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
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12"
      />
    </svg>
  ),
};

import type { LucideIcon, LucideProps } from "lucide-react";
import { Menu, Star, User, Trash } from "lucide-react";
import * as React from "react"; // Import React

type Icons = Record<
  string,
  LucideIcon | ((props: LucideProps) => React.ReactNode)
>; // Adjusted the type

const iconComponents: Icons = {
  // github: Github,
  menu: Menu,
  user: User,
  star: Star,
  trash: Trash,
  google: () => {
    return (
      <svg
        fill="#000000"
        version="1.1"
        id="Capa_1"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        viewBox="0 0 210 210"
        xmlSpace="preserve"
        height="1.5em"
        width="1.5em"
      >
        <path
          d="M0,105C0,47.103,47.103,0,105,0c23.383,0,45.515,7.523,64.004,21.756l-24.4,31.696C133.172,44.652,119.477,40,105,40
        c-35.841,0-65,29.159-65,65s29.159,65,65,65c28.867,0,53.398-18.913,61.852-45H105V85h105v20c0,57.897-47.103,105-105,105
        S0,162.897,0,105z"
        />
      </svg>
    );
  },
  github: (props) => {
    return (
      <svg
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        viewBox="0 0 24 24"
        height="1.5em"
        width="1.5em"
        {...props}
      >
        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" />
      </svg>
    );
  },
};

const NoIconFound: React.FC = () => {
  return null;
};

const Icons: React.FC<{ iconName: string }> = ({ iconName }) => {
  const iconComponent = iconComponents[iconName.toLowerCase()] ?? NoIconFound;

  return <>{React.createElement(iconComponent)}</>;
};

export default Icons;

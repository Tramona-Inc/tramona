import type { LucideIcon } from 'lucide-react';
import { Github, Menu, Star, User } from 'lucide-react';
import * as React from 'react'; // Import React

type Icons = Record<string, LucideIcon>;

const iconComponents: Icons = {
  github: Github,
  menu: Menu,
  user: User,
  star: Star,

  // Add more icons as needed
};

const NoIconFound: React.FC = () => {
  return null;
};

const Icons: React.FC<{ iconName: string }> = ({ iconName }) => {
  const iconComponent = iconComponents[iconName.toLowerCase()] ?? NoIconFound;

  return <>{React.createElement(iconComponent)}</>;
};

export default Icons;

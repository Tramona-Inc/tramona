import type { LucideIcon } from "lucide-react";
import { Github } from "lucide-react";
import * as React from "react"; // Import React

type Icons = Record<string, LucideIcon>;

const iconComponents: Icons = {
  github: Github,
  // Add more icons as needed
};

const NoIconFound: React.FC = () => {
  return <div>No Icon Found</div>;
};

const Icons: React.FC<{ iconName: string }> = ({ iconName }) => {
  const iconComponent = iconComponents[iconName.toLowerCase()] ?? NoIconFound;

  return <>{React.createElement(iconComponent)}</>;
};

export default Icons;

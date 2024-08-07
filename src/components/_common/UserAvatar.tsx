import {
  AnonymousAvatar,
  Avatar,
  AvatarFallback,
  AvatarImage,
  type AvatarVariants,
} from "../ui/avatar";
import { cn } from '@/utils/utils';
function getInitials(name: string) {
  return name
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("");
}

export default function UserAvatar({
  name,
  email,
  image,
  size,
  className,
}: {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  className?:string | null;
} & AvatarVariants) {

  if (!name && !email && !image) return <AnonymousAvatar size={size} />;
  const fallback = name ? getInitials(name) : email?.[0] ?? "?";
  return (
    <Avatar size={size} >
      {image ? <AvatarImage src={image} alt="" className={cn(className, "rounded-full") ?? ""}/> : <AvatarFallback>{fallback}</AvatarFallback>}
      {/* <AvatarImage src={image ?? ""} alt="" className={cn(className, "rounded-full") ?? ""}/> */}
      {/* <AvatarImage src="/assets/images/profile-avatars/Avatar_2.png" alt="" className={cn(className, "rounded-full") ?? ""}/>  */}
    </Avatar>
  );
}

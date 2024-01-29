import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  type AvatarVariants,
} from "../ui/avatar";

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
  ...props
}: {
  name: string | null | undefined;
  email: string | null | undefined;
  image: string | null | undefined;
} & AvatarVariants) {
  const fallback = name ? getInitials(name) : email?.[0] ?? "?";

  return (
    <Avatar {...props}>
      {image && <AvatarImage src={image} alt="" />}
      <AvatarFallback>{fallback}</AvatarFallback>
    </Avatar>
  );
}

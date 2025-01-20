import {
  AnonymousAvatar,
  Avatar,
  AvatarFallback,
  AvatarImage,
  type AvatarVariants,
} from "../ui/avatar";

export function getInitials(name: string) {
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
  size = "md",
}: {
  name?: string | null;
  email?: string | null;
  image?: string | null;
} & AvatarVariants) {
  if (!name && !email && !image) return <AnonymousAvatar size={size} />;
  const fallback = name ? getInitials(name) : (email?.[0] ?? "?");
  return (
    <Avatar size={size}>
      {image ? (
        <AvatarImage src={image} alt="" />
      ) : (
        <AvatarFallback>{fallback}</AvatarFallback>
      )}
    </Avatar>
  );
}

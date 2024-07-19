import {
  AnonymousAvatar,
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

export default function UserAvatarMastHead({
  name,
  email,
  image,
  size,
}: {
  name?: string | null;
  email?: string | null;
  image?: string | null;
} & AvatarVariants) {
  if (!name && !email && !image) return <AnonymousAvatar size={size} />;
  const fallback = name ? getInitials(name) : email?.[0] ?? "?";
  return (
    <Avatar className="border-2 border-white" size={size}>
      {image ? (
        <AvatarImage src={image} alt="" />
      ) : (
        <AvatarFallback>{fallback}</AvatarFallback>
      )}
    </Avatar>
  );
}

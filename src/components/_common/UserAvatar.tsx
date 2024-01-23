import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("");
}

export default function UserAvatar(props: {
  name: string | null | undefined;
  email: string | null | undefined;
  image: string | null | undefined;
}) {
  const fallback = props.name
    ? getInitials(props.name)
    : props.email?.[0] ?? "?";

  return (
    <Avatar className="h-10 w-10">
      {props.image && <AvatarImage src={props.image} alt="" />}
      <AvatarFallback>{fallback}</AvatarFallback>
    </Avatar>
  );
}

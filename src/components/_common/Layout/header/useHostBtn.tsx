import { api } from "@/utils/api";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { ArrowLeftRightIcon, DoorOpen } from "lucide-react";

export default function useHostBtn(isMobile?: boolean) {
  const { data: isHost, isLoading: isHostLoading } =
    api.users.isHost.useQuery();

  const { status: sessionStatus } = useSession();

  const { pathname } = useRouter();

  if (sessionStatus === "loading" || isHostLoading) {
    return { isLoading: true } as const;
  }

  if (sessionStatus === "unauthenticated" || !isHost) {
    return {
      href: "/why-list",
      name: isMobile ? "Host" : "Become a host",
      icon: DoorOpen,
    } as const;
  }

  if (pathname.includes("/host")) {
    return {
      href: "/",
      name: "Switch to Traveler",
      icon: ArrowLeftRightIcon,
    } as const;
  }

  return {
    href: "/host",
    name: "Switch to Host",
    icon: ArrowLeftRightIcon,
  } as const;
}

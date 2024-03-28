import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogOutIcon } from "lucide-react";
import UserAvatar from "../_common/UserAvatar";

export default function ProfileSidebar() {
  const { data: session } = useSession({ required: true });

  return (
    <div className="hidden w-96 justify-center bg-black pt-32 lg:flex">
      {session?.user && (
        <div className="flex flex-col text-white">
          <div className="flex items-center justify-center">
            <UserAvatar
              size="huge"
              name={session.user.name}
              email={session.user.email}
              image={session.user.image}
            />
          </div>
          <div>
            <div className="my-4">
              <p className="text-3xl font-bold">{session.user.name}</p>
              <p className="text-base">
                Member since{" "}
                {new Date(session.user.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div>
            <Button
              onClick={() => signOut()}
              variant="secondary"
              className="w-full gap-2"
            >
              <div className="-scale-x-100">
                <LogOutIcon />
              </div>
              Log out
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

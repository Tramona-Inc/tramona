import { Button } from "@/components/ui/button";
import { api } from "@/utils/api";
import { BadgeCheck, LogOutIcon } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import UserAvatar from "../_common/UserAvatar";
import IdentityModal from "../_utils/IdentityModal";

export default function ProfileSidebar() {
  const { data: session } = useSession({ required: true });
  const { data: user } = api.users.myVerificationStatus.useQuery();

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
          <div className="flex flex-col gap-y-2">
            {user?.isIdentityVerified === "false" ? (
              <IdentityModal />
            ) : user?.isIdentityVerified === "pending" ? (
              <div className="mb-4 flex justify-center gap-x-2">
                {" "}
                Pending <BadgeCheck className="text-yellow-600"></BadgeCheck>{" "}
              </div>
            ) : (
              <div className="mb-4 flex justify-center gap-x-2">
                {" "}
                Verified <BadgeCheck className="text-green-600"></BadgeCheck>
              </div>
            )}
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

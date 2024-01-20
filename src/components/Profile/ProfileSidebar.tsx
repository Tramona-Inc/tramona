import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogOutIcon } from "lucide-react";

export default function ProfileSidebar() {
  const { data: session } = useSession();

  const onSignOut = () => signOut();

  return (
    <div className="hidden w-96 justify-center bg-black pt-32 lg:flex">
      <div className="flex flex-col text-white">
        <div className="flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={
              session?.user?.image ||
              "https://cdn1.vectorstock.com/i/1000x1000/51/05/male-profile-avatar-with-brown-hair-vector-12055105.jpg"
            }
            className="h-44 w-44 rounded-full"
            alt="User's profile picture"
          />
        </div>
        <div>
          <div className="my-4">
            <p className="text-3xl font-bold">{session?.user?.name}</p>
            <p className="text-base">Member since 10/22/2023</p>
          </div>
          <div className="my-8 space-y-4">
            <div>
              <p className="text-sm text-zinc-500">Average review given</p>
              <p className="text-xl font-bold">3.17</p>
            </div>
            <div>
              <p className="text-sm text-zinc-500">Average review received</p>
              <p className="text-xl font-bold">4.86</p>
            </div>
            <div>
              <p className="text-sm text-zinc-500">Total experiences made</p>
              <p className="text-xl font-bold">3</p>
            </div>
          </div>
        </div>
        <div>
          <Button
            onClick={onSignOut}
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
    </div>
  );
}

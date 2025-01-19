import { api } from "@/utils/api";
import { useDialogState } from "@/utils/dialog";
import {
  BadgeCheck,
  BadgeXIcon,
  Clock2Icon,
  Edit,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import UserAvatar from "../_common/UserAvatar";
import { Button } from "../ui/button";
import EditProfileDialog from "./EditProfileDialog";
import StripeVerificationCard from "../_common/StripeVerificationCard";

export default function ProfilePage() {
  const { data: session } = useSession({ required: true });

  const { data: verificationStatus } =
    api.users.myVerificationStatus.useQuery();

  const { data: profileInfo } = api.profile.getProfileInfo.useQuery();

  const editProfileDialogState = useDialogState();
  console.log(profileInfo);

  return (
    <div className="mx-auto min-h-screen-minus-header max-w-4xl space-y-3 pb-10">
      <section className="rounded-lg border">
        <div className="relative h-40 bg-teal-900 lg:h-52"></div>
        <div className="relative grid grid-cols-1 gap-4 p-5 lg:grid-cols-4 lg:gap-0 lg:p-4">
          <UserAvatar
            size="huge"
            name={profileInfo?.name}
            email={profileInfo?.email}
            image={profileInfo?.image}
          />
          <div className="mt-7 flex flex-col gap-1 lg:col-span-2 lg:col-start-2 lg:-ml-4 lg:mt-0">
            <div className="lg:-translate-x-20">
              <div className="flex items-center gap-x-2">
                <h2 className="text-xl font-bold lg:text-2xl">
                  {profileInfo?.name}
                </h2>
                {verificationStatus?.isIdentityVerified === "true" ? ( // TODO: cleanup and display stripe verification somewhere else
                  <div className="flex flex-row items-center gap-x-1 text-center text-xs font-semibold tracking-tighter text-green-800">
                    <BadgeCheck size={22} /> Verified
                  </div>
                ) : verificationStatus?.isIdentityVerified === "pending" ? (
                  <div className="flex flex-row items-center gap-x-1 text-xs font-semibold tracking-tighter text-yellow-600">
                    <Clock2Icon size={22} /> Pending
                  </div>
                ) : (
                  <div className="flex flex-row items-center gap-x-1 text-xs font-semibold tracking-tighter text-red-500">
                    <BadgeXIcon size={22} /> Not Verified
                  </div>
                )}
              </div>

              <p className="font-semibold">{profileInfo?.location}</p>

              <div className="mt-2 flex space-x-2">
                {profileInfo?.socials?.[0] && (
                  <Link href={profileInfo.socials[0]} target="_blank">
                    <Facebook />
                  </Link>
                )}
                {profileInfo?.socials?.[1] && (
                  <Link href={profileInfo.socials[1]} target="_blank">
                    <Youtube />
                  </Link>
                )}
                {profileInfo?.socials?.[2] && (
                  <Link href={profileInfo.socials[2]} target="_blank">
                    <Instagram />
                  </Link>
                )}
                {profileInfo?.socials?.[3] && (
                  <Link href={profileInfo.socials[3]} target="_blank">
                    <Twitter />
                  </Link>
                )}
              </div>
            </div>
          </div>
          <div className="flex gap-3 lg:col-start-4 lg:justify-end">
            <Button
              variant="secondary"
              onClick={() => editProfileDialogState.setState("open")}
            >
              <Edit />
              Edit Profile
            </Button>
          </div>
        </div>
      </section>
      <section className="mx-4 space-y-3 md:mx-auto">
        {/* pop up if no verified */}
        {verificationStatus?.isIdentityVerified === "true" && (
          <StripeVerificationCard />
        )}

        {/* About Me */}
        <div className="space-y-2 rounded-lg border p-4">
          <h2 className="font-bold">About Me</h2>
          <p>{profileInfo?.about}</p>
          <p>
            {"Joined Tramona " +
              (session?.user.createdAt
                ? new Date(session.user.createdAt).toLocaleDateString()
                : "")}
          </p>
        </div>
      </section>

      {profileInfo && (
        <EditProfileDialog
          state={editProfileDialogState}
          profileInfo={{
            name: profileInfo.name ?? session?.user.username ?? "",
            about:
              profileInfo.about ??
              "Joined Tramona at " +
                (session?.user.createdAt
                  ? new Date(session.user.createdAt)
                      .toISOString()
                      .substring(0, 10)
                  : ""),
            location: profileInfo.location ?? "",
            facebook_link: profileInfo.socials?.[0] ?? "",
            youtube_link: profileInfo.socials?.[1] ?? "",
            instagram_link: profileInfo.socials?.[2] ?? "",
            twitter_link: profileInfo.socials?.[3] ?? "",
          }}
        />
      )}
    </div>
  );
}

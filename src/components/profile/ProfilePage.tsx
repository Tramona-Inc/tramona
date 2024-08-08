import { api } from "@/utils/api";
import { useDialogState } from "@/utils/dialog";
import {
  BadgeCheck,
  BadgeXIcon,
  Clock2Icon,
  Edit,
  Ellipsis,
  Facebook,
  InfoIcon,
  Instagram,
  Mail,
  MessageCircle,
  MessageCircleMore,
  MessagesSquare,
  Twitter,
  Youtube,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import UserAvatar from "../_common/UserAvatar";
import IdentityModal from "../_utils/IdentityModal";
import { VerificationProvider } from "../_utils/VerificationContext";
import { Button } from "../ui/button";
import EditProfileDialog from "./EditProfileDialog";
import { useMemo, useState } from "react";

export default function ProfilePage() {
  const { data: session } = useSession({ required: true });

  const { data } = api.users.myReferralCode.useQuery();
  const { data: verificationStatus } =
    api.users.myVerificationStatus.useQuery();
  const code =
    session?.user.referralCodeUsed && data?.referralCode
      ? ""
      : data?.referralCode;
  const url = `https://tramona.com/auth/signup?code=${code}`;

  const { data: profileInfo } = api.profile.getProfileInfo.useQuery();

  const editProfileDialogState = useDialogState();

  return (
    <div className="mx-auto min-h-screen-minus-header max-w-4xl space-y-3 pb-10">
      {/* Profile Header */}
      <section className="rounded-lg border">
        <div className="relative h-40 bg-teal-900 lg:h-52">
          {/* <Button className="absolute bottom-4 right-4 h-12 w-12 rounded-full bg-primary/20 p-0 lg:w-auto lg:rounded-lg lg:px-3">
            <Camera />
            <p className="hidden lg:block">Edit Cover Photo</p>
          </Button> */}
        </div>
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
                {verificationStatus?.isIdentityVerified == "true" ? (
                  <div className="flex flex-row items-center gap-x-1 text-center text-xs font-semibold tracking-tighter text-green-800">
                    <BadgeCheck size={22} /> Verified
                  </div>
                ) : verificationStatus?.isIdentityVerified == "pending" ? (
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
      {/* pop up if no verified */}
      {verificationStatus?.isIdentityVerified == "false" && (
        <section className="flex flex-col justify-center gap-x-2 rounded-lg border border-red-200 p-4">
          <div className="flex flex-row gap-x-1 font-bold">
            <InfoIcon size={24} className="text-red-400" /> Verify your Identity
          </div>
          <p className="ml-2">
            Hosts are more likely to accept your bid when they know who you are.
          </p>
          <div className="mt-3 flex w-1/4">
            <VerificationProvider>
              <IdentityModal />
            </VerificationProvider>
          </div>
        </section>
      )}

      {/* About Me */}
      <section className="space-y-2 rounded-lg border p-4">
        <h2 className="font-bold">About Me</h2>
        <p>
          {profileInfo?.about ??
            "Joined Tramona " +
              (session?.user.createdAt
                ? new Date(session.user.createdAt).toLocaleDateString()
                : "")}
        </p>
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

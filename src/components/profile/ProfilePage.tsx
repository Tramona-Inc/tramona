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
  Plus,
  Twitter,
  Youtube,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from 'next/router';
import Link from "next/link";
import React from "react";
import UserAvatar from "../_common/UserAvatar";
import IdentityModal from "../_utils/IdentityModal";
import { VerificationProvider } from "../_utils/VerificationContext";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import AddBucketListDestinationDialog from "./AddBucketListDestinationDialog";
import BucketListHomeOfferCard from "./BucketListHomeOfferCard";
import DeleteBucketListDestinationDialog from "./DeleteBucketListDestinationDialog";
import DestinationCard from "./DestinationCard";
import EditBucketListDestinationDialog from "./EditBucketListDestinationDialog";
import EditProfileDialog from "./EditProfileDialog";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session } = useSession({ required: true });

  const { data } = api.users.myReferralCode.useQuery();
  const { data: verificationStatus } =
    api.users.myVerificationStatus.useQuery();
  const code =
    session?.user?.referralCodeUsed && data?.referralCode
      ? ""
      : data?.referralCode;
  const url = `https://tramona.com/auth/signup?code=${code}`;

  const socials = [
    {
      name: "Twitter",
      icon: <Twitter />,
    },
    {
      name: "Email",
      icon: <Mail />,
    },
    {
      name: "Messages",
      icon: <MessagesSquare />,
    },
    {
      name: "WhatsApp",
      icon: <MessageCircle />,
    },
    {
      name: "Messenger",
      icon: <MessageCircleMore />,
    },
    {
      name: "Facebook",
      icon: <Facebook />,
    },
    {
      name: "More Options",
      icon: <Ellipsis />,
    },
  ];

  const { data: profileInfo } = api.profile.getProfileInfo.useQuery();

  const { data: bucketListProperties } =
    api.profile.getAllPropertiesWithDetails.useQuery();

  const [selectedBLDestinationId, setSelectedBLDestinationId] = React.useState<
    number | null
  >(null);

  const selectedBLDestination = React.useMemo(() => {
    return profileInfo?.bucketListDestinations.find(
      (d) => d.id === selectedBLDestinationId,
    );
  }, [profileInfo, selectedBLDestinationId]);

  const editProfileDialogState = useDialogState();
  const editBLDestinationDialogState = useDialogState();
  const addBLDestinationDialogState = useDialogState();

  const deleteBLDDialogState = useDialogState();

  return (
    <div className="mx-auto mb-5 min-h-screen-minus-header max-w-4xl space-y-3">
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
            <div className="flex flex-row items-center justify-start gap-x-2 lg:-translate-x-20">
              <h2 className="text-xl font-bold lg:text-2xl">
                {profileInfo?.name}
              </h2>
              {verificationStatus?.isIdentityVerified == "true" ? (
                <div className="flex flex-row items-center gap-x-1  text-center text-xs font-semibold tracking-tighter text-green-800">
                  <BadgeCheck size={22} /> Verified
                </div>
              ) : verificationStatus?.isIdentityVerified == "pending" ? (
                <div className="flex flex-row items-center  gap-x-1 text-xs font-semibold tracking-tighter text-yellow-600">
                  <Clock2Icon size={22} /> Pending
                </div>
              ) : (
                <div className="flex flex-row items-center  gap-x-1 text-xs font-semibold tracking-tighter text-red-500">
                  <BadgeXIcon size={22} /> Not Verified
                </div>
              )}
            </div>

            <p className="font-semibold">{profileInfo?.location}</p>
            <div className="mt-2 flex space-x-2">
              {profileInfo?.socials?.[0] && (
                <Facebook href={profileInfo.socials[0]} />
              )}
              {profileInfo?.socials?.[1] && (
                <Youtube href={profileInfo.socials[1]} />
              )}
              {profileInfo?.socials?.[2] && (
                <Instagram href={profileInfo.socials[2]} />
              )}
              {profileInfo?.socials?.[3] && (
                <Twitter href={profileInfo.socials[3]} />
              )}
            </div>
          </div>
          <div className="flex gap-3 lg:col-start-4 lg:justify-end">
            <Button
              className="w-1/2 bg-[#cfd8d6]/75 text-primary hover:bg-[#cfd8d6] lg:w-auto"
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
          <div className="flex flex-row gap-x-1 font-bold ">
            <InfoIcon size={24} className="text-red-400" /> Verify your Identity
          </div>
          <p className="ml-2">
            Hosts are more likely to accept your bid when they know who you are.
          </p>
          <div className="  mt-3 flex w-1/4">
            <VerificationProvider>
              <IdentityModal />
            </VerificationProvider>
          </div>
        </section>
      )}
      {/* Bucket List */}

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

      <section className="space-y-5 rounded-lg border p-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bold">Bucket List</h2>
          <div className="flex items-center">
            {/* <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  className="hidden font-bold text-teal-900 lg:flex"
                >
                  <Share />
                  Share
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader className="border-b-2 pb-4">
                  <DialogTitle>
                    <h2 className="text-center">Share</h2>
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <h2 className="text-lg font-bold">Your link</h2>
                  <div className="flex gap-2">
                    <div className="basis-5/6">
                      <Input value={url} className="text-base" disabled />
                    </div>
                    <CopyToClipboardBtn
                      message={url}
                      render={({ justCopied, copyMessage }) => (
                        <Button
                          onClick={copyMessage}
                          className="w-full bg-teal-900 px-6 lg:w-auto"
                        >
                          {justCopied ? "Copied!" : "Copy"}
                        </Button>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {socials.map((social, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 rounded-lg border-2 p-4"
                      >
                        {social.icon}
                        <p className="font-semibold">{social.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </DialogContent>
            </Dialog> */}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="font-bold text-teal-900">
                  <Plus />
                  Add
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <Link href="/">
                  <DropdownMenuItem>Property</DropdownMenuItem>
                </Link>
                <DropdownMenuItem
                  onClick={() => addBLDestinationDialogState.setState("open")}
                >
                  Destination
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <Tabs defaultValue="properties" className="space-y-4">
          <TabsList>
            <TabsTrigger
              value="properties"
              className="font-bold data-[state=active]:border-teal-900 data-[state=active]:text-teal-900"
            >
              Properties
            </TabsTrigger>
            <TabsTrigger
              value="destinations"
              className="font-bold data-[state=active]:border-teal-900 data-[state=active]:text-teal-900"
            >
              Destinations
            </TabsTrigger>
          </TabsList>

          {/* Properties Tab */}
          <TabsContent value="properties">
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-3 lg:gap-4">
              {bucketListProperties?.length ? (
                bucketListProperties?.map((property) => (
                  <BucketListHomeOfferCard
                    key={property!.id}
                    property={{
                      ...property!,
                      propertyId: property!.id,
                      bucketListPropertyId: property!.bucketListId,
                    }}
                  />
                ))
              ) : (
                <>
                  <p className="col-span-full py-8 text-center text-muted-foreground">
                    <div className="flex justify-center items-center">
                      
                      <img src="assets/images/profile-page/no-items-cart.png" alt="No items in cart"/>
                    </div>
                    Your bucket list is empty! Add a property to view here.
                    <div className="flex justify-center mt-6">
                      <Button
                        onClick={() => router.push('/explore')}
                        className="bg-teal-900 hover:bg-teal-950 text-white py-2 px-4 rounded-lg cursor-pointer"
                      >
                        Explore Properties
                      </Button>
                    </div>
                  </p>
                </>
              )
            }

            </div>
          </TabsContent>

          {/* Destinations Tab */}
          <TabsContent value="destinations">
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-3 lg:gap-4">
              {profileInfo?.bucketListDestinations?.length ? (
                profileInfo?.bucketListDestinations.map((destination) => (
                  <DestinationCard
                    key={destination.id}
                    destination={destination}
                    onEdit={() => {
                      setSelectedBLDestinationId(destination.id);
                      editBLDestinationDialogState.setState("open");
                    }}
                    onDelete={() => {
                      setSelectedBLDestinationId(destination.id);
                      deleteBLDDialogState.setState("open");
                    }}
                  />
                ))
              ) : (
                <p className="col-span-full py-8 text-center text-muted-foreground">
                  No destinations yet
                </p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </section>

      <AddBucketListDestinationDialog state={addBLDestinationDialogState} />
      <EditBucketListDestinationDialog
        state={editBLDestinationDialogState}
        destinationData={selectedBLDestination!}
      />
      <DeleteBucketListDestinationDialog
        state={deleteBLDDialogState}
        destinationId={selectedBLDestinationId!}
      />

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

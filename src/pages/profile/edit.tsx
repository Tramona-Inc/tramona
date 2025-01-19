"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

import { ProfilePhotoDialog } from "@/components/dashboard/host/profile/ProfilePhotoDialog";
import { Card } from "@/components/ui/card";
import { VerificationCard } from "@/components/dashboard/host/profile/VerificationCard";
import DashboardLayout from "../../components/_common/Layout/DashboardLayout/index";
import { api } from "@/utils/api";
import { PenSquare } from "lucide-react";
import AllFieldDialogs from "@/components/dashboard/host/profile/AllFieldDialogs";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function Page() {
  const { data: session } = useSession();
  const [isPhotoDialogOpen, setIsPhotoDialogOpen] = useState(false);

  const { data: myUserWProfile } = api.users.getMyUserWProfile.useQuery();
  const memoizedUser = useMemo(() => myUserWProfile, [myUserWProfile]);

  const imageSrc =
    myUserWProfile?.user.image ??
    session?.user.image ??
    "https://res.cloudinary.com/heyset/image/upload/v1689582418/buukmenow-folder/no-image-icon-0.jpg";

  return (
    <DashboardLayout>
      <div className="mx-auto grid max-w-8xl gap-8 md:grid-cols-[300px_1fr]">
        <div className="space-y-4">
          <Card className="p-6">
            <div className="space-y-4">
              <div className="relative h-32 w-32">
                <Image
                  src={imageSrc}
                  alt="Profile picture"
                  fill
                  className="rounded-full object-cover"
                />

                <Button
                  size="sm"
                  variant="secondary"
                  className="absolute -bottom-2 -right-2"
                  onClick={() => setIsPhotoDialogOpen(true)}
                >
                  <PenSquare className="mr-1 h-4 w-4" />
                  Edit
                </Button>
              </div>
              <div>
                <h2 className="text-2xl font-semibold">Your Name</h2>
                <p className="text-sm text-muted-foreground">Host</p>
              </div>
            </div>
          </Card>
          <VerificationCard />
        </div>
        <AllFieldDialogs myUserWProfile={memoizedUser} />
      </div>{" "}
      <ProfilePhotoDialog
        open={isPhotoDialogOpen}
        onOpenChange={setIsPhotoDialogOpen}
        myUserWProfile={memoizedUser}
      />
      <div
        className={`fixed bottom-0 flex w-screen flex-row items-center justify-end border-2 bg-white py-3 transition-opacity duration-300`}
      >
        <Button variant="primary" size="sm" className="mx-auto px-4 py-2">
          <Link href={`view/${myUserWProfile?.userId}`}>Done</Link>
        </Button>
      </div>
    </DashboardLayout>
  );
}

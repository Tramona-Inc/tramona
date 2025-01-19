"use client";

import { useState, useEffect } from "react";
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

export default function Page() {
  const { data: session } = useSession();
  const [isPhotoDialogOpen, setIsPhotoDialogOpen] = useState(false);
  const [isButtonVisible, setIsButtonVisible] = useState(true);

  const { data: myUserWProfile } = api.users.getMyUserWProfile.useQuery();

  const imageSrc =
    myUserWProfile?.user.image ?? session?.user.image ?? "/default-profile.png";

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
              <div className="flex gap-4">
                <div>
                  <div className="font-semibold">1</div>
                  <div className="text-sm text-muted-foreground">Review</div>
                </div>
                <div>
                  <div className="font-semibold">2</div>
                  <div className="text-sm text-muted-foreground">
                    Months hosting
                  </div>
                </div>
              </div>
            </div>
          </Card>
          <VerificationCard />
        </div>
        <AllFieldDialogs myUserWProfile={myUserWProfile} />
      </div>{" "}
      <ProfilePhotoDialog
        open={isPhotoDialogOpen}
        onOpenChange={setIsPhotoDialogOpen}
        myUserWProfile={myUserWProfile}
      />
      <div
        className={`fixed bottom-0 flex w-screen flex-row items-center justify-end border-2 bg-white py-3 transition-opacity duration-300 border${
          isButtonVisible ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <Button variant="primary" size="sm" className="mx-auto px-4 py-2">
          Done
        </Button>
      </div>
    </DashboardLayout>
  );
}

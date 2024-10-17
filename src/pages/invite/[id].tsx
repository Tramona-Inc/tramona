import { api } from "@/utils/api";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useInviteStore } from "@/utils/store/inviteLink";
import { NextSeo } from "next-seo";
import { toast } from "@/components/ui/use-toast";

export default function Invite() {
  const router = useRouter();
  const setInviteLinkId = useInviteStore((state) => state.setInviteLinkId);
  const inviteLinkId = router.query.id as string;
  useEffect(() => {
    if (inviteLinkId) {
      setInviteLinkId(inviteLinkId);
    }
  }, [inviteLinkId, setInviteLinkId]);

  useSession({ required: true });

  // how to get this to not hit, unless it needs to
  const { mutate: inviteUser } = api.groups.inviteCurUserToGroup.useMutation();

  useEffect(() => {
    if (inviteLinkId) {
      inviteUser(
        { inviteLinkId },
        {
          onSuccess: () => {
            toast({ title: "Successfully joined the group!" });
            void router.push(`/requests`);
          },
        },
      );
    }
  }, [inviteLinkId, inviteUser, router]);

  return (
    <div>
      <NextSeo
        title="Invite to group"
        description="Invite link to join group"
        canonical={`https://www.tramona.com/invite/${inviteLinkId}`}
        openGraph={{
          url: `https://www.tramona.com/invite/${inviteLinkId}`,
          type: "website",
          title: "Invite to group",
          description: "Invite link to join group",
          images: [
            {
              url: "tramona.com/api/og?cover=https://a0.muscache.com/im/pictures/prohost-api/Hosting-1162477721754661798/original/0c00ec02-540d-4d24-ba50-638ccd676340.jpeg?im_w=720",
              width: 900,
              height: 800,
              alt: "Og Image Alt Second",
              type: "image/jpeg",
            },
          ],
          site_name: "Tramona",
        }}
      />
      <div className="grid h-screen place-items-center">
        <h1 className="text-lg text-muted-foreground">Joining group...</h1>
      </div>
    </div>
  );
}

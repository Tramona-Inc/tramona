import { api } from "@/utils/api";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useInviteStore } from "@/utils/store/inviteLink";
import { NextSeo } from "next-seo";
import { GetServerSideProps } from "next";
import { db } from "@/server/db";



export default function Invite() {
  const router = useRouter();
  const setInviteLinkId = useInviteStore((state) => state.setInviteLinkId);
  const inviteLinkId = router.query.id as string;
  useEffect(() => {
    if (inviteLinkId) {
      setInviteLinkId(inviteLinkId);
    }
  }, [inviteLinkId, setInviteLinkId]);

  useSession({required: true});

  // how to get this to not hit, unless it needs to
  const { mutate: inviteUser } = api.groups.inviteUserById.useMutation();

  useEffect(() => {
    if (inviteLinkId) {
      inviteUser(
        { inviteLinkId },
        {
          onSuccess: () => {
            void router.push(`/requests`);
          },
        },
      );
    }
  }, [inviteLinkId]);

  return (
    <div>
      <NextSeo
        title="Invite to group 1"
        description="Invite link to join group 1"
        canonical={`https://www.tramona.com/invite/${inviteLinkId}`}
        openGraph={{
          url: `https://www.tramona.com/invite/${inviteLinkId}`,
          type: "website",
          title: "Invite to group 1",
          description: "Invite link to join group 1",
          images: [
            {
              url: "https://eb50-2601-600-8e81-3180-a582-a67c-29a5-6c49.ngrok-free.app/api/og?cover=https://a0.muscache.com/im/pictures/prohost-api/Hosting-1162477721754661798/original/0c00ec02-540d-4d24-ba50-638ccd676340.jpeg?im_w=720",
              width: 900,
              height: 800,
              alt: "Og Image Alt Second",
              type: "image/jpeg",
            },
          ],
          site_name: "Tramona",
        }}
      />
      <h1>invite</h1>
    </div>
  );
}



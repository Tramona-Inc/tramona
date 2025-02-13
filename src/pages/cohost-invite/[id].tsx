import { api } from "@/utils/api";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useCohostInviteStore } from "@/utils/store/cohostInvite";
import { NextSeo } from "next-seo";
import { toast } from "@/components/ui/use-toast";

export default function CohostInvite() {
  const router = useRouter();
  const setCohostInviteId = useCohostInviteStore(
    (state) => state.setCohostInviteId,
  );
  const cohostInviteId = router.query.id as string;

  const { status } = useSession();

  const { mutate: validateCohostInvite } =
    api.hostTeams.validateCohostInvite.useMutation();

  useEffect(() => {
    if (cohostInviteId) {
      setCohostInviteId(cohostInviteId);
    }
  }, [cohostInviteId, setCohostInviteId]);

  useEffect(() => {
    if (status === "authenticated" && cohostInviteId) {
      const timer = setTimeout(() => {
        validateCohostInvite(
          { cohostInviteId },
          {
            onSuccess: () => {
              void router.push("/cohost-onboarding");
            },
            onError: (error) => {
              toast({
                title: "Invalid or expired invite",
                description: error.message,
                variant: "destructive",
              });
              void router.push("/");
            },
          },
        );
      }, 1000);

      return () => clearTimeout(timer);
    } else if (status === "unauthenticated") {
      const currentUrl = `/cohost-invite/${cohostInviteId}`;
      void router.push(
        `/auth/signin?callbackUrl=${encodeURIComponent(currentUrl)}`,
      );
    }
  }, [status, cohostInviteId, validateCohostInvite, router]);

  return (
    <div>
      <NextSeo
        title="Cohost Invite"
        description="Invite link to join as a cohost"
        canonical={`https://www.tramona.com/cohost-invite/${cohostInviteId}`}
        openGraph={{
          url: `https://www.tramona.com/cohost-invite/${cohostInviteId}`,
          type: "website",
          title: "Cohost Invite",
          description: "Invite link to join as a cohost",
          images: [
            {
              url: "tramona.com/api/og/route?cover=https://a0.muscache.com/im/pictures/prohost-api/Hosting-1162477721754661798/original/0c00ec02-540d-4d24-ba50-638ccd676340.jpeg?im_w=720&type=property",
              width: 900,
              height: 800,
              alt: "Og Image Alt Second",
              type: "image/jpeg",
            },
          ],
        }}
      />
      <div className="grid h-screen place-items-center">
        <h1 className="text-lg text-muted-foreground">
          Processing cohost invitation...
        </h1>
      </div>
    </div>
  );
}

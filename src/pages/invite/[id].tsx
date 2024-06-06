import { api } from "@/utils/api";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useInviteStore } from "@/utils/store/inviteLink";

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
      <h1>invite</h1>
    </div>
  );
}

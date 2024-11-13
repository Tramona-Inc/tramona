import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { api } from "@/utils/api";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { useCohostInviteStore } from "@/utils/store/cohostInvite";

export default function CohostInviteAcceptance() {
  const router = useRouter();
  const { toast } = useToast();
  const [isAccepting, setIsAccepting] = useState(false);
  const cohostInviteId = useCohostInviteStore((state) => state.cohostInviteId);
  const [hostTeamId, setHostTeamId] = useState<number | null>(null);
  const [hostTeamName, setHostTeamName] = useState<string | null>(null);

  const { isLoading: isLoadingProfile } = api.users.getUser.useQuery();

  const { mutate: validateCohostInvite } =
    api.hostTeams.validateCohostInvite.useMutation({
      onSuccess: (data) => {
        setHostTeamId(data.hostTeamId);
        setHostTeamName(data.hostTeamName);
      },
      onError: (error) => {
        toast({
          title: "Invalid Invite",
          description: error.message,
          variant: "destructive",
        });
        void router.push("/");
      },
    });

  useEffect(() => {
    if (cohostInviteId) {
      validateCohostInvite({ cohostInviteId });
    }
  }, [cohostInviteId, validateCohostInvite]);

  const { mutate: joinHostTeam } = api.hostTeams.joinHostTeam.useMutation({
    onSuccess: (data) => {
      if (data.status === "joined team") {
        toast({
          title: "Invite Accepted",
          description: `You've successfully joined ${data.hostTeamName}'s team!`,
        });
        void router.push("/");
      } else if (data.status === "already in team") {
        toast({
          title: "Already a Member",
          description: `You're already a member of ${data.hostTeamName}'s team.`,
        });
        void router.push("/");
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const { mutate: declineHostTeamInvite } =
    api.hostTeams.declineHostTeamInvite.useMutation({
      onSuccess: () => {
        toast({
          title: "Invite Declined",
          description: "You've declined the host team invitation.",
        });
        void router.push("/");
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      },
    });

  const handleAccept = () => {
    if (!cohostInviteId) {
      toast({
        title: "Error",
        description: "Invalid invite. Please try again.",
        variant: "destructive",
      });
      return;
    }
    setIsAccepting(true);
    joinHostTeam({ cohostInviteId });
  };

  const handleDecline = () => {
    if (!cohostInviteId) {
      toast({
        title: "Error",
        description: "Invalid invite. Please try again.",
        variant: "destructive",
      });
      return;
    }
    declineHostTeamInvite({ cohostInviteId });
    void router.push("/");
  };

  if (isLoadingProfile || hostTeamId === null) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <Dialog open={true}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Host Team Invitation</DialogTitle>
          </DialogHeader>
          <div className="py-6">
            <p className="mb-6 text-center">
              {`You've been invited to join ${hostTeamName} on Tramona. Would you like to accept this invitation?`}
            </p>
            <div className="flex justify-center space-x-4">
              <Button onClick={handleAccept} disabled={isAccepting}>
                {isAccepting ? "Accepting..." : "Accept Invite"}
              </Button>
              <Button onClick={handleDecline} variant="outline">
                Decline
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

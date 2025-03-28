import Onboarding1 from "@/components/host/onboarding/Onboarding1";
// import Onboarding10 from "@/components/host/onboarding/Onboarding10";
import Onboarding2 from "@/components/host/onboarding/Onboarding2";
import Onboarding3 from "@/components/host/onboarding/Onboarding3";
import Onboarding4 from "@/components/host/onboarding/Onboarding4";
import Onboarding5 from "@/components/host/onboarding/Onboarding5";
import Onboarding6 from "@/components/host/onboarding/Onboarding6";
import Onboarding7 from "@/components/host/onboarding/Onboarding7";
import Onboarding8 from "@/components/host/onboarding/Onboarding8";
import Onboarding9 from "@/components/host/onboarding/Onboarding9";
import { useHostOnboarding } from "@/utils/store/host-onboarding";
import OnboardingLayout from "../components/host/onboarding/layout";
import Onboarding10 from "@/components/host/onboarding/Onboarding10";
import Onboarding11 from "@/components/host/onboarding/Onboarding11";
import Onboarding12 from "@/components/host/onboarding/Onboarding12";
import OnboardingLinkInput from "@/components/host/onboarding/OnboardingLinkInput";
import Onboarding13 from "@/components/host/onboarding/Onboarding13";
import { getFeed } from "@/server/api/routers/feedRouter";
import { type InferGetStaticPropsType } from "next";
import { useSession } from "next-auth/react";
import { api } from "@/utils/api";
import { useRouter } from "next/router";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";

export const getStaticProps = async () => {
  const requestFeed = await getFeed({ maxNumEntries: 10 }).then((r) =>
    r.filter((r) => r.type === "request"),
  );
  return {
    props: { requestFeed },
    revalidate: 60 * 5, // 5 minutes
  };
};

type Props = InferGetStaticPropsType<typeof getStaticProps>;

export default function Onboarding({ requestFeed }: Props) {
  const progress = useHostOnboarding((state) => state.progress);
  const setProgress = useHostOnboarding((state) => state.setProgress);
  const { data: session } = useSession({ required: true });
  const router = useRouter();
  const { toast } = useToast();
  const { data: isUserHostTeamOwner } =
    api.hostTeams.isUserHostTeamOwner.useQuery(
      {
        userId: session?.user.id,
      },
      {
        enabled: !!session,
      },
    );

  useEffect(() => {
    if (isUserHostTeamOwner) {
      toast({
        variant: "destructive",
        title: `You are already a host team owner`,
        description: "You can't create a new host team",
      });
      void router.push("/host");
    }
  }, [isUserHostTeamOwner, router, toast]);

  function onPressNext() {
    setProgress(progress + 1);
  }

  return (
    <OnboardingLayout className="flex flex-col">
      {progress === 0 && <Onboarding1 onPressNext={onPressNext} />}
      {progress === 1 && <Onboarding2 />}
      {progress === 2 && <Onboarding3 />}
      {progress === 3 && <Onboarding4 />}
      {progress === 4 && <Onboarding5 />}
      {progress === 5 && <Onboarding6 />}
      {progress === 6 && <Onboarding7 />}
      {progress === 7 && <Onboarding8 />}
      {progress === 8 && <Onboarding9 />}
      {progress === 9 && <Onboarding10 />}
      {progress === 10 && <OnboardingLinkInput />}
      {progress === 11 && <Onboarding11 />}
      {progress === 12 && <Onboarding12 />}
      {progress === 13 && <Onboarding13 requestFeed={requestFeed} />}
    </OnboardingLayout>
  );
}

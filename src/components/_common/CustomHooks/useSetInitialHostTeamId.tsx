import { api } from "@/utils/api";
import { useHostTeamStore } from "@/utils/store/hostTeamStore";
import { useEffect } from "react";

export default function useSetInitialHostTeamId() {
  console.log("running");
  const setCurrentHostTeam = useHostTeamStore(
    (state) => state.setCurrentHostTeam,
  );
  const currentHostTeamId = useHostTeamStore(
    (state) => state.currentHostTeamId,
  );

  const { data: initialHostTeamId } =
    api.hostTeams.getInitialHostTeamId.useQuery({
      enabled: Boolean(currentHostTeamId === null || undefined),
    });

  useEffect(() => {
    if (!currentHostTeamId && initialHostTeamId) {
      setCurrentHostTeam(initialHostTeamId);
      localStorage.setItem("currentHostTeamId", String(initialHostTeamId));
      console.log(initialHostTeamId);
    }
  }, [currentHostTeamId, initialHostTeamId, setCurrentHostTeam]);
}

import { api } from "@/utils/api";
import { useHostTeamStore } from "@/utils/store/hostTeamStore";
import { useEffect } from "react";

export default function useSetInitialHostTeamId() {
  const setCurrentHostTeam = useHostTeamStore(
    (state) => state.setCurrentHostTeam,
  );
  const currentHostTeamId = useHostTeamStore(
    (state) => state.currentHostTeamId,
  );

  // Load from sessionStorage on mount
  useEffect(() => {
    const storedTeamId = sessionStorage.getItem("currentHostTeamId");
    if (storedTeamId) {
      setCurrentHostTeam(Number(storedTeamId));
    }
  }, [setCurrentHostTeam]);

  // Fetch the first team if currentHostTeamId doesn't exist
  api.hostTeams.getInitialHostTeamId.useQuery(undefined, {
    enabled: !currentHostTeamId, // Only fetch if no currentHostTeamId
    onSuccess: (data) => {
      if (data && !currentHostTeamId) {
        setCurrentHostTeam(data);
        sessionStorage.setItem("currentHostTeamId", data.toString());
      }
    },
  });

  // Save changes to sessionStorage whenever currentHostTeamId updates
  useEffect(() => {
    if (currentHostTeamId) {
      sessionStorage.setItem("currentHostTeamId", currentHostTeamId.toString());
    }
  }, [currentHostTeamId]);
}

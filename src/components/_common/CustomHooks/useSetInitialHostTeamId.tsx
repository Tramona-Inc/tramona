import { api } from "@/utils/api";
import { useHostTeamStore } from "@/utils/store/hostTeamStore";

export default function useSetInitialHostTeamId() {
  const setCurrentHostTeam = useHostTeamStore(
    (state) => state.setCurrentHostTeam,
  );
  const currentHostTeamId = useHostTeamStore(
    (state) => state.currentHostTeamId,
  );

  // Fetch the first team if currentHostTeamId doesn't exist
  const { data: initialHostTeamId } =
    api.hostTeams.getInitialHostTeamId.useQuery(undefined, {
      enabled: !currentHostTeamId, // Only fetch if no currentHostTeamId
      onSuccess: (data) => {
        if (data && !currentHostTeamId) {
          console.log(data);
          setCurrentHostTeam(data);
          console.log("Loaded from API:", currentHostTeamId);
        }
      },
    });
}

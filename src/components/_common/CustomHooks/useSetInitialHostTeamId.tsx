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

  //1.) Check to see if it exist in local storage first.
  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedHostTeamId = localStorage.getItem("currentHostTeamId");
    if (
      storedHostTeamId !== undefined && //ignore this lint error, because it can be undefined.
      storedHostTeamId !== null &&
      !currentHostTeamId
    ) {
      // Load from localStorage if available
      setCurrentHostTeam(Number(storedHostTeamId));
      console.log("Loaded from localStorage:", storedHostTeamId);
    }
  }, [setCurrentHostTeam, currentHostTeamId]);

  //2.) if it doesnt exist on local storage then query the first team
  const { data: initialHostTeamId } =
    api.hostTeams.getInitialHostTeamId.useQuery(undefined, {
      enabled:
        typeof window !== "undefined" &&
        !currentHostTeamId &&
        !localStorage.getItem("currentHostTeamId"), // Only fetch if no local data
      onSuccess: (data) => {
        if (data && !currentHostTeamId) {
          // Set fetched data if local data is unavailable
          setCurrentHostTeam(data);
          localStorage.setItem("currentHostTeamId", String(data));
          console.log("Loaded from API and saved to localStorage:", data);
        }
      },
    });

  // 3.) Sync changes to `currentHostTeamId` with localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (currentHostTeamId) {
      localStorage.setItem("currentHostTeamId", String(currentHostTeamId));
      console.log(
        "Updated localStorage with currentHostTeamId:",
        currentHostTeamId,
      );
    }
  }, [currentHostTeamId]);
}

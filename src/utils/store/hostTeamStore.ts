import { create } from "zustand";

interface HostTeamStore {
  currentHostTeamId: number | undefined | null;
  setCurrentHostTeam: (hostTeamId: number) => void;
  clearCurrentHostTeam: () => void;
}

export const useHostTeamStore = create<HostTeamStore>((set) => ({
  currentHostTeamId: null, // Set initial value to null
  setCurrentHostTeam: (hostTeamId) => set({ currentHostTeamId: hostTeamId }),
  clearCurrentHostTeam: () => set({ currentHostTeamId: null }),
}));

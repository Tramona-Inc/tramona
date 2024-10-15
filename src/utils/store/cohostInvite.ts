import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface CohostInviteState {
  cohostInviteId: string | null;
  setCohostInviteId: (id: string | null) => void;
  resetCohostInviteId: () => void;
}

export const useCohostInviteStore = create<CohostInviteState>()(
  persist(
    (set) => ({
      cohostInviteId: null,
      setCohostInviteId: (id) => set({ cohostInviteId: id }),
      resetCohostInviteId: () => set({ cohostInviteId: null }),
    }),
    {
      name: 'cohost-invite-storage', // unique name for localStorage
      storage: createJSONStorage(() => localStorage), // use localStorage for persistence
    }
  )
);
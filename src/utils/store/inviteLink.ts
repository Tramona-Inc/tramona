import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface InviteState {
  inviteLinkId: string | null;
  setInviteLinkId: (id: string | null) => void;
  resetInviteLinkId: () => void;
}

export const useInviteStore = create<InviteState>()(
  persist(
    (set) => ({
      inviteLinkId: null,
      setInviteLinkId: (id) => set({ inviteLinkId: id }),
      resetInviteLinkId: () => set({ inviteLinkId: null }),
    }),
    {
      name: 'invite-link-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // use localStorage for persistence
    }
  )
);

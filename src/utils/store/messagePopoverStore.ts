import { create } from 'zustand';

interface PopoverStore {
  open: boolean;
  setOpen: (isOpen: boolean) => void;
  toggleOpen: () => void;
}

const usePopoverStore = create<PopoverStore>((set) => ({
  open: false,
  setOpen: (isOpen) => set({ open: isOpen }),
  toggleOpen: () => set((state) => ({ open: !state.open })),
}));

export default usePopoverStore;

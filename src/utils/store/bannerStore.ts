import { create } from 'zustand';

interface BannerStore {
  isCalendar: boolean;
  setIsCalendar: (isCalendar: boolean) => void;
  toggleIsCalendar: () => void;
}

const useBannerStore = create<BannerStore>((set) => ({
  isCalendar: false,
  setIsCalendar: (isCalendar) => set({ isCalendar }),
  toggleIsCalendar: () => set((state) => ({ isCalendar: !state.isCalendar })),
}));

export default useBannerStore;

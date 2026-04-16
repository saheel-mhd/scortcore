import { create } from 'zustand'

type UiStore = {
  isSidebarOpen: boolean
  closeSidebar: () => void
  openSidebar: () => void
  toggleSidebar: () => void
}

export const useUiStore = create<UiStore>((set) => ({
  isSidebarOpen: false,
  closeSidebar: () => set({ isSidebarOpen: false }),
  openSidebar: () => set({ isSidebarOpen: true }),
  toggleSidebar: () =>
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
}))

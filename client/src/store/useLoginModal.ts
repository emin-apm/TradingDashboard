import { create } from "zustand";

type ModalState = {
  showLoginModal: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  toggleLoginModal: () => void;
};

export const useModalStore = create<ModalState>((set) => ({
  showLoginModal: false,
  openLoginModal: () => set({ showLoginModal: true }),
  closeLoginModal: () => set({ showLoginModal: false }),
  toggleLoginModal: () =>
    set((state) => ({ showLoginModal: !state.showLoginModal })),
}));

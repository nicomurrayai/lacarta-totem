'use client';

import { create } from 'zustand';

interface UserStore {
  userId: string | null;
  setUserId: (id: string | null) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  userId: null,
  setUserId: (id) => set({ userId: id }),
}));

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface PasskeyStoreModel {
  passkey_id: string;
  user_code: string;
  challenge_buffer: string;
}

const initialState:any = {
  passkey_id: null,
  user_code: null,
  challenge_buffer: null
}

const passkeyPersist = persist<PasskeyStoreModel>(
  (set) => ({
    ...initialState,
    reset: () => set(initialState)
  }),
  {
    name: "siguri-passkey-storage",
    storage: createJSONStorage(() => localStorage),
  }
);

export const passkeyStore = create<PasskeyStoreModel>()(passkeyPersist);
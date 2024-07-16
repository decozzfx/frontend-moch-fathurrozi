import { create } from "zustand";
import { persist, StateStorage, createJSONStorage } from "zustand/middleware";

import {
  AuthResponseType,
  UseStoreActionType,
  UseStoreStateType,
} from "../types";

const persistentStorage: StateStorage = {
  getItem: (key): string => {
    return JSON.parse(localStorage.getItem(key) as string);
  },
  setItem: (key, newValue): void => {
    localStorage.setItem(key, JSON.stringify(newValue));
  },
  removeItem: (): void => {
    localStorage.clear();
  },
};

const storageOptions = {
  name: "userStorage",
  storage: createJSONStorage<UseStoreStateType & UseStoreActionType>(
    () => persistentStorage
  ),
};

const useStore = create(
  persist<UseStoreStateType & UseStoreActionType>(
    (set) => ({
      user: {},
      setUser: (user: AuthResponseType) =>
        set((state) => ({ ...state, user: user })),
    }),
    storageOptions
  )
);

export default useStore;

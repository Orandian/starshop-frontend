import { create } from "zustand";
import { SignUpRequest, User } from "@/types/auth";
import { getToken, getUser, logout } from "@/lib/api/auth";
import { LoginUser } from "@/types/fc";
import { clearAllQueries } from "@/utils";

interface UserState {
  user: User | LoginUser | null;
  token: string | null;
  setUser: (user: LoginUser) => void;
  setToken: (token: string) => void;
  clearUser: () => void;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
  signUpInfo: SignUpRequest | null;
  setSignUpInfo: (info: SignUpRequest) => void;

  forgotPasswordInfo: { email: string } | null;
  setForgotPasswordInfo: (info: { email: string }) => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  token: null,
  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),
  clearUser: () => set({ user: null, token: null }),
  logout: async () => {
     clearAllQueries();
    set({ user: null, token: null });
    await logout();
  },
  initialize: async () => {
    const token = await getToken();
    const user = await getUser();
    if (token) {
      set({ token });
    }
    if (user) {
      set({ user });
    }
  },
  signUpInfo: null,
  setSignUpInfo: (info) => set({ signUpInfo: info }),
  
  forgotPasswordInfo: null,
  setForgotPasswordInfo: (forgotPasswordInfo) => set({ forgotPasswordInfo }),
}));

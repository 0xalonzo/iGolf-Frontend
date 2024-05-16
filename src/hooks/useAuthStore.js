import { create } from "zustand";

const useAuthStore = create((set) => ({
  user: {
    username: "",
    password: "",
    fullname: "",
  },
  token: "",

  setUser: (user) =>
    set((state) => ({
      user: {
        ...state.user,
        username: user.username,
        password: user.password,
        fullname: user.fullname,
      },
    })),

  setToken: (token) =>
    set(() => ({
      token: token,
    })),
}));

export default useAuthStore;

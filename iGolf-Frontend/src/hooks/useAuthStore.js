import { create } from "zustand";

const useAuthStore = create((set) => ({
  user: {
    id: "",
    username: "",
    password: "",
    fullname: "",
    favoriteCourses: [],
  },
  token: "",

  setUser: (user) =>
    set((state) => ({
      user: {
        ...state.user,
        id: user.id,
        username: user.username,
        password: user.password,
        fullname: user.fullname,
        favoriteCourses: user.favoriteCourses,
      },
    })),

  setToken: (token) =>
    set(() => ({
      token: token,
    })),
}));

export default useAuthStore;

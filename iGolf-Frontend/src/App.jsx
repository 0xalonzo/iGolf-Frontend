import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Navbar from "./components/Navbar";

import useAuthStore from "./hooks/useAuthStore";

export default function App() {
  const { setToken, setUser } = useAuthStore();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (token && user) {
      setToken(token);
      setUser(user);
    }
  }, [setToken, setUser]);

  return (
    <>
      <Navbar />
      <main>
        <Toaster />
        <Outlet />
      </main>
    </>
  );
}

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState({
    role: "unauthenticated",
    user: null,
    foodpartner: null,
    loading: true,
  });

  const getSession = async () => {
    try {
      const response = await api.get("/api/auth/me", {
        withCredentials: true,
      });

      const payload = response.data || {};
      const isUser = Boolean(payload.user);
      const isFoodPartner = Boolean(payload.foodpartner);

      setSession({
        role: isFoodPartner ? "foodpartner" : isUser ? "user" : "unauthenticated",
        user: payload.user || null,
        foodpartner: payload.foodpartner || null,
        loading: false,
      });
    } catch (error) {
      setSession({
        role: "unauthenticated",
        user: null,
        foodpartner: null,
        loading: false,
      });
    }
  };

  useEffect(() => {
    getSession();
  }, []);

  const logout = async () => {
    try {
      const currentRole = session.role;
      if (currentRole === "foodpartner") {
        await api.get("/api/auth/foodpartner/logout", {
          withCredentials: true,
        });
      } else if (currentRole === "user") {
        await api.get("/api/auth/user/logout", {
          withCredentials: true,
        });
      }
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      setSession({
        role: "unauthenticated",
        user: null,
        foodpartner: null,
        loading: false,
      });
    }
  };

  const value = useMemo(
    () => ({
      session,
      setSession,
      getSession,
      logout,
    }),
    [session]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

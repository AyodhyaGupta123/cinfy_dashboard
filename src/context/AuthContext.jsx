import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("auth_token");

      if (!token) {
        setUser(null);
        return;
      }

      const res = await api.get("/auth/profile");

      if (res.data.success) {
        updateUser(res.data.user);
      }
    } catch (error) {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);

      const res = await api.post("/auth/login", {
        email,
        password,
      });

      if (res.data.success) {
        localStorage.setItem("auth_token", res.data.token);
        updateUser(res.data.user);

        return {
          success: true,
          message: res.data.message,
          user: res.data.user,
        };
      }

      return {
        success: false,
        message: res.data.message || "Login failed",
      };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Something went wrong. Please try again.",
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        updateUser,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};

export default AuthContext;
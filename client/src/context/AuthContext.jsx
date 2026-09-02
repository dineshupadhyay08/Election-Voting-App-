import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../store/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCurrentUser = async () => {
    try {
      setLoading(true);
      const res = await api.get("/voters/me");
      // store/axios doesn't have interceptor, so res is the axios response object
      // res.data contains the actual data
      setUser(res.data);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const login = async (email, password) => {
    const res = await api.post("/voters/login", { email, password });
    // store/axios doesn't have interceptor, so res.data contains the user object
    setUser(res.data);
    return res.data;
  };

  const register = async (userData) => {
    const res = await api.post("/voters/register", userData);
    return res;
  };

  const logout = async () => {
    try {
      await api.post("/voters/logout");
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, register, logout, fetchCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

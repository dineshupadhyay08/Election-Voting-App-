import { createContext, useContext, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../store/axios";

const AuthContext = createContext(null);

const getProfile = async () => {
  const { data } = await api.get("/voters/me");
  return data;
};

export const AuthProvider = ({ children }) => {
  const queryClient = useQueryClient();
  const authQuery = useQuery({
    queryKey: ["auth", "profile"],
    queryFn: getProfile,
    retry: false,
    staleTime: 60 * 1000,
  });

  const value = useMemo(
    () => ({
      user: authQuery.data || null,
      isAuthenticated: Boolean(authQuery.data),
      isLoading: authQuery.isLoading,
      isError: authQuery.isError,
      refreshAuth: () => queryClient.invalidateQueries({ queryKey: ["auth"] }),
      logout: async () => {
        try {
          await api.post("/voters/logout");
        } catch {
          // Ignore logout API failures and clear client state anyway.
        } finally {
          window.localStorage.removeItem("userId");
          window.localStorage.removeItem("isAdmin");
          queryClient.setQueryData(["auth", "profile"], null);
        }
      },
    }),
    [authQuery.data, authQuery.isError, authQuery.isLoading, queryClient],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};

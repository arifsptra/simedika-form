import { createContext, useContext } from "react";
import type { ReactNode } from "react";
import useLocalStorage from "../hooks/useLocalStorage";

interface AuthContextType {
  isAuthenticated: boolean;
  userEmail: string;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useLocalStorage<boolean>(
    "simedika_is_authenticated",
    false,
  );
  const [userEmail, setUserEmail] = useLocalStorage<string>(
    "simedika_user_email",
    "",
  );

  const login = (email: string, password: string) => {
    const safeEmail = email.trim();
    const safePassword = password.trim();

    if (!safeEmail || !safePassword) {
      return false;
    }

    setIsAuthenticated(true);
    setUserEmail(safeEmail);
    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserEmail("");
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        userEmail,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

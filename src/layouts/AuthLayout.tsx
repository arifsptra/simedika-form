import { Navigate, Outlet } from "react-router-dom";
import { ThemeToggle } from "../components/general/ThemeToggle";
import { useAuth } from "../contexts/AuthContext";
import useColorMode from "../hooks/useColorMode";

const AuthLayout = () => {
  const [colorMode, setColorMode] = useColorMode();
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-kdark-bg">
      <div className="absolute right-4 top-4 z-20 sm:right-6 sm:top-6">
        <ThemeToggle colorMode={colorMode} setColorMode={setColorMode} />
      </div>

      <section className="flex min-h-screen items-center justify-center p-6">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </section>
    </div>
  );
};

export default AuthLayout;

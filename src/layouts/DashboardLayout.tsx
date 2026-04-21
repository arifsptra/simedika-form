import { Link, Outlet } from "react-router-dom";
import { LayoutDashboard, LogOut, House } from "lucide-react";
import { Button } from "../components/general/Button";
import { useAuth } from "../contexts/AuthContext";
import useColorMode from "../hooks/useColorMode";
import { ThemeToggle } from "../components/general/ThemeToggle";

const DashboardLayout = () => {
  const [colorMode, setColorMode] = useColorMode();
  const { userEmail, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-kdark-bg">
      <header className="border-b border-slate-200 bg-white px-4 py-3 sm:px-6 lg:px-8 dark:border-kdark-border-subtle dark:bg-kdark-surface">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3">
          <div>
            <h1 className="inline-flex items-center gap-2 text-lg font-semibold text-slate-800 dark:text-lime-100">
              <LayoutDashboard size={18} />
              Dasbor Data Formulir
            </h1>
            <p className="text-xs text-slate-500 dark:text-lime-200/70">
              Masuk sebagai {userEmail}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle colorMode={colorMode} setColorMode={setColorMode} />
            <Link to="/">
              <Button variant="secondary" leftIcon={<House size={16} />}>
                Halaman Formulir
              </Button>
            </Link>
            <Button
              variant="ghost"
              leftIcon={<LogOut size={16} />}
              onClick={logout}
            >
              Keluar
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;

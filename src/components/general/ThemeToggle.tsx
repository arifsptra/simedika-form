import { Monitor, Moon, Sun } from "lucide-react";
import { cn } from "../../utils/cn";
import type { ColorMode } from "../../hooks/useColorMode";

interface ThemeToggleProps {
  colorMode: ColorMode;
  setColorMode: (mode: ColorMode) => void;
}

export const ThemeToggle = ({ colorMode, setColorMode }: ThemeToggleProps) => {
  const options: Array<{
    value: ColorMode;
    icon: React.ReactNode;
  }> = [
    { value: "light", icon: <Sun size={16} /> },
    { value: "dark", icon: <Moon size={16} /> },
    { value: "system", icon: <Monitor size={16} /> },
  ];

  return (
    <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1 dark:border-kdark-border-subtle dark:bg-kdark-surface">
      {options.map((option) => {
        const isActive = colorMode === option.value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => setColorMode(option.value)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors cursor-pointer",
              isActive
                ? "bg-lime-500 text-white dark:text-kdark-bg"
                : "text-slate-600 hover:bg-slate-100 dark:text-lime-100 dark:hover:bg-kdark-elevated",
            )}
          >
            {option.icon}
          </button>
        );
      })}
    </div>
  );
};

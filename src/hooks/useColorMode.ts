import { useEffect, useCallback, useState } from "react";
import useLocalStorage from "./useLocalStorage";

export type ColorMode = "dark" | "light" | "system";

const prefersDarkMode = () => {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );
};

const useColorMode: () => [
  ColorMode,
  (mode: ColorMode) => void,
  boolean,
] = () => {
  const [colorMode, setColorMode] = useLocalStorage<ColorMode>(
    "color-theme",
    "system",
  );
  const [systemIsDark, setSystemIsDark] = useState(prefersDarkMode());

  const applyTheme = useCallback((mode: "dark" | "light") => {
    const htmlClass = window.document.documentElement.classList;
    const themeClass = "dark";

    if (mode === "dark") {
      htmlClass.add(themeClass);
      document.body.setAttribute("data-theme", "dark");
      return;
    }

    htmlClass.remove(themeClass);
    document.body.setAttribute("data-theme", "light");
  }, []);

  useEffect(() => {
    const effectiveTheme =
      colorMode === "system" ? (systemIsDark ? "dark" : "light") : colorMode;

    applyTheme(effectiveTheme);

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const listener = (event: MediaQueryListEvent) =>
      setSystemIsDark(event.matches);

    mediaQuery.addEventListener("change", listener);
    return () => mediaQuery.removeEventListener("change", listener);
  }, [applyTheme, colorMode, systemIsDark]);

  const isDark =
    colorMode === "dark" || (colorMode === "system" && systemIsDark);

  return [colorMode, setColorMode, isDark];
};

export default useColorMode;

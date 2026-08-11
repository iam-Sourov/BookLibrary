import { useEffect, useState } from "react";

export const useTheme = () => {
  const [isDark, setIsDark] = useState(
    () => document.documentElement.classList.contains("dark")
  );

  useEffect(() => {
    const listen = (e) => {
      if (e.key === "theme") {
        document.documentElement.classList.toggle("dark", e.newValue === "dark");
        setIsDark(e.newValue === "dark");
      }
    };
    window.addEventListener("storage", listen);
    return () => window.removeEventListener("storage", listen);
  }, []);

  const toggleTheme = () => {
    const newState = !isDark;
    setIsDark(newState);
    document.documentElement.classList.toggle("dark", newState);
    localStorage.setItem("theme", newState ? "dark" : "light");
  };
  return { isDark, toggleTheme };
};

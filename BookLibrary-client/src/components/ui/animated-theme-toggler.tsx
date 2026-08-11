import { useRef } from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/hooks/useTheme";
import { flushSync } from "react-dom";

export const AnimatedThemeToggler = ({ className, duration = 450 }) => {
  const { isDark, toggleTheme } = useTheme();
  const btnRef = useRef(null);

  const handleToggle = () => {
    if (!document.startViewTransition) {
      toggleTheme();
      return;
    }

    document.startViewTransition(() => {
      flushSync(() => toggleTheme());
    });
  };

  return (
    <button
      ref={btnRef}
      onClick={handleToggle}
      className={cn("p-2 rounded-full", className)}
    >
      {isDark ? <Sun /> : <Moon />}
      <span className="sr-only">Toggle theme</span>
    </button>
  );
};

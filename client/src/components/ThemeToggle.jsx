import { Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center justify-center w-10 h-10 rounded-xl glass hover:bg-[var(--surface-hover)] transition-colors"
      title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      aria-label="Toggle theme"
    >
      {theme === "light" ? (
        <Moon size={20} className="text-amber-600" />
      ) : (
        <Sun size={20} className="text-amber-400" />
      )}
    </button>
  );
};

export default ThemeToggle;

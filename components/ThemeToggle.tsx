"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="w-9 h-9" />;

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
      className="w-9 h-9 flex items-center justify-center rounded-lg transition-all duration-200"
      style={{
        background: "var(--card)",
        border: "1px solid var(--border)",
        color: "var(--text-secondary)",
      }}
    >
      {theme === "dark" ? (
        <Sun size={16} className="hover:text-yellow-400 transition-colors" />
      ) : (
        <Moon size={16} className="hover:text-blue-500 transition-colors" />
      )}
    </button>
  );
}

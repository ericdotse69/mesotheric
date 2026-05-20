"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const themes = [
  {
    value: "dark",
    label: "Dark",
    icon: Moon,
  },
  {
    value: "light",
    label: "Light",
    icon: Sun,
  },
  {
    value: "system",
    label: "System",
    icon: Monitor,
  },
] as const;

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed right-4 top-4 z-[9999] rounded-full border border-amber-500/30 bg-stone-950/95 p-1 shadow-2xl backdrop-blur-xl">
      <div className="flex items-center gap-1">
        {themes.map((item) => {
          const Icon = item.icon;
          const isActive = theme === item.value;

          return (
            <button
              key={item.value}
              type="button"
              onClick={() => setTheme(item.value)}
              className={`flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold transition ${
                isActive
                  ? "bg-amber-400 text-stone-950"
                  : "text-stone-300 hover:bg-stone-800 hover:text-amber-300"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
"use client";

import Dashboard from "@/components/Dashboard";
import { useEffect } from "react";
import { useDashboardStore } from "@/store/dashboardStore";

export default function Home() {
  const { theme, loadFromStorage } = useDashboardStore();

  useEffect(() => {
    loadFromStorage();
    // Initialize theme on mount
    if (typeof document !== "undefined") {
      const savedTheme = localStorage.getItem("finboard-storage");
      if (savedTheme) {
        try {
          const parsed = JSON.parse(savedTheme);
          if (parsed.state?.theme) {
            document.documentElement.classList.toggle("dark", parsed.state.theme === "dark");
          }
        } catch (e) {
          // Ignore parse errors
        }
      }
    }
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark", theme === "dark");
    }
  }, [theme]);

  return (
    <main className="min-h-screen">
      <Dashboard />
    </main>
  );
}


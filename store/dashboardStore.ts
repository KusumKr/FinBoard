import { create } from "zustand";
import { persist } from "zustand/middleware";

export type WidgetType = "table" | "card" | "chart";
export type ChartType = "line" | "candle";
export type CardType = "watchlist" | "gainers" | "performance" | "financial";

export interface WidgetConfig {
  id: string;
  type: WidgetType;
  title: string;
  apiEndpoint?: string;
  apiKey?: string;
  refreshInterval?: number;
  selectedFields?: string[];
  chartType?: ChartType;
  chartInterval?: "daily" | "weekly" | "monthly";
  cardType?: CardType;
  data?: any;
  error?: string;
  loading?: boolean;
  width?: number;
  height?: number;
}

interface DashboardState {
  widgets: WidgetConfig[];
  theme: "light" | "dark";
  addWidget: (widget: WidgetConfig) => void;
  removeWidget: (id: string) => void;
  updateWidget: (id: string, updates: Partial<WidgetConfig>) => void;
  reorderWidgets: (startIndex: number, endIndex: number) => void;
  toggleTheme: () => void;
  loadFromStorage: () => void;
  exportConfig: () => string;
  importConfig: (config: string) => void;
}

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set, get) => ({
      widgets: [],
      theme: "light",

      addWidget: (widget) =>
        set((state) => ({
          widgets: [...state.widgets, widget],
        })),

      removeWidget: (id) =>
        set((state) => ({
          widgets: state.widgets.filter((w) => w.id !== id),
        })),

      updateWidget: (id, updates) =>
        set((state) => ({
          widgets: state.widgets.map((w) =>
            w.id === id ? { ...w, ...updates } : w
          ),
        })),

      reorderWidgets: (startIndex, endIndex) =>
        set((state) => {
          const newWidgets = Array.from(state.widgets);
          const [removed] = newWidgets.splice(startIndex, 1);
          newWidgets.splice(endIndex, 0, removed);
          return { widgets: newWidgets };
        }),

      toggleTheme: () =>
        set((state) => {
          const newTheme = state.theme === "light" ? "dark" : "light";
          if (typeof document !== "undefined") {
            document.documentElement.classList.toggle("dark", newTheme === "dark");
          }
          return { theme: newTheme };
        }),

      loadFromStorage: () => {
        if (typeof document !== "undefined") {
          const theme = localStorage.getItem("dashboard-theme") || "light";
          document.documentElement.classList.toggle("dark", theme === "dark");
        }
      },

      exportConfig: () => {
        const state = get();
        return JSON.stringify(
          {
            widgets: state.widgets,
            theme: state.theme,
          },
          null,
          2
        );
      },

      importConfig: (config) => {
        try {
          const parsed = JSON.parse(config);
          set({
            widgets: parsed.widgets || [],
            theme: parsed.theme || "light",
          });
          if (typeof document !== "undefined") {
            document.documentElement.classList.toggle(
              "dark",
              parsed.theme === "dark"
            );
          }
        } catch (error) {
          console.error("Failed to import config:", error);
        }
      },
    }),
    {
      name: "finboard-storage",
      partialize: (state) => ({
        widgets: state.widgets,
        theme: state.theme,
      }),
    }
  )
);


"use client";

import { useDashboardStore } from "@/store/dashboardStore";
import { Moon, Sun, Download, Upload, Plus } from "lucide-react";
import { useRef } from "react";

interface HeaderProps {
  onAddWidget: () => void;
}

export default function Header({ onAddWidget }: HeaderProps) {
  const { theme, toggleTheme, exportConfig, importConfig } = useDashboardStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const config = exportConfig();
    const blob = new Blob([config], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "finboard-config.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        importConfig(content);
      };
      reader.readAsText(file);
    }
  };

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 sticky top-0 z-50 backdrop-blur-sm bg-opacity-95 dark:bg-opacity-95">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">F</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                FinBoard
              </h1>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={onAddWidget}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 font-medium"
            >
              <Plus size={18} />
              Add Widget
            </button>
            
            <button
              onClick={handleExport}
              className="p-2.5 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-slate-700 transition-all duration-200 border border-gray-200 dark:border-slate-700"
              title="Export Configuration"
            >
              <Download size={18} />
            </button>
            
            <button
              onClick={handleImport}
              className="p-2.5 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-slate-700 transition-all duration-200 border border-gray-200 dark:border-slate-700"
              title="Import Configuration"
            >
              <Upload size={18} />
            </button>
            
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileChange}
              className="hidden"
            />
            
            <button
              onClick={toggleTheme}
              className="p-2.5 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-slate-700 transition-all duration-200 border border-gray-200 dark:border-slate-700"
              title="Toggle Theme"
            >
              {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}


"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useDashboardStore, WidgetType, CardType } from "@/store/dashboardStore";

const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
};

interface AddWidgetModalProps {
  onClose: () => void;
}

export default function AddWidgetModal({ onClose }: AddWidgetModalProps) {
  const { addWidget } = useDashboardStore();
  const [widgetType, setWidgetType] = useState<WidgetType>("table");
  const [title, setTitle] = useState("");
  const [cardType, setCardType] = useState<CardType>("watchlist");
  const [apiEndpoint, setApiEndpoint] = useState("");
  const [apiKey, setApiKey] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const widget = {
      id: generateId(),
      type: widgetType,
      title: title || `New ${widgetType} Widget`,
      apiEndpoint: apiEndpoint || undefined,
      apiKey: apiKey || undefined,
      refreshInterval: 60000,
      cardType: widgetType === "card" ? cardType : undefined,
      chartType: widgetType === "chart" ? "line" : undefined,
      chartInterval: widgetType === "chart" ? "daily" : undefined,
    };

    addWidget(widget);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-gray-200/50 dark:border-slate-700/50">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-slate-700 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-slate-800 dark:to-slate-800 rounded-t-2xl">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            Add New Widget
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Widget Type
            </label>
            <select
              value={widgetType}
              onChange={(e) => setWidgetType(e.target.value as WidgetType)}
              className="w-full px-4 py-3 border-2 border-gray-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-700/50 text-gray-900 dark:text-white focus:border-emerald-500 dark:focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
            >
              <option value="table">Table</option>
              <option value="card">Finance Card</option>
              <option value="chart">Chart</option>
            </select>
          </div>

          {widgetType === "card" && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Card Type
              </label>
              <select
                value={cardType}
                onChange={(e) => setCardType(e.target.value as CardType)}
                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-700/50 text-gray-900 dark:text-white focus:border-emerald-500 dark:focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
              >
                <option value="watchlist">Watchlist</option>
                <option value="gainers">Market Gainers</option>
                <option value="performance">Performance Data</option>
                <option value="financial">Financial Data</option>
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Widget Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={`Enter ${widgetType} widget title`}
              className="w-full px-4 py-3 border-2 border-gray-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-700/50 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-emerald-500 dark:focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              API Endpoint (Optional)
            </label>
            <input
              type="text"
              value={apiEndpoint}
              onChange={(e) => setApiEndpoint(e.target.value)}
              placeholder="https://api.example.com/data"
              className="w-full px-4 py-3 border-2 border-gray-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-700/50 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-emerald-500 dark:focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              API Key (Optional)
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter API key"
              className="w-full px-4 py-3 border-2 border-gray-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-700/50 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-emerald-500 dark:focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border-2 border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-all font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all shadow-lg shadow-emerald-500/30 font-semibold"
            >
              Add Widget
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


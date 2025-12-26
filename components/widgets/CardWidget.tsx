"use client";

import { useEffect, useState } from "react";
import { WidgetConfig, CardType } from "@/store/dashboardStore";
import { FinanceAPI } from "@/lib/api/financeApi";
import { extractNestedValue, formatValue } from "@/lib/utils/dataMapper";
import { Loader2, AlertCircle, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface CardWidgetProps {
  widget: WidgetConfig;
}

export default function CardWidget({ widget }: CardWidgetProps) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
    if (widget.refreshInterval) {
      const interval = setInterval(fetchData, widget.refreshInterval);
      return () => clearInterval(interval);
    }
  }, [widget.apiEndpoint, widget.apiKey, widget.cardType]);

  const fetchData = async () => {
    const api = new FinanceAPI(widget.apiKey);
    setLoading(true);
    setError(null);

    try {
      let response;
      
      switch (widget.cardType) {
        case "gainers":
          response = await api.getTopGainers();
          if (response.data) {
            setData(response.data["top_gainers"] || []);
          }
          break;
        case "watchlist":
          // Default watchlist - show popular stocks
          const symbols = ["AAPL", "GOOGL", "MSFT", "AMZN", "TSLA"];
          const quotes = await Promise.all(
            symbols.map((sym) => api.getQuote(sym))
          );
          setData(quotes.map((q) => q.data?.["Global Quote"] || {}).filter(Boolean));
          break;
        case "performance":
          response = await api.getTopGainers();
          if (response.data) {
            const gainers = response.data["top_gainers"] || [];
            const losers = response.data["top_losers"] || [];
            setData([...gainers.slice(0, 3), ...losers.slice(0, 3)]);
          }
          break;
        case "financial":
          // Fetch company overview for a default symbol
          response = await api.getCompanyOverview("AAPL");
          if (response.data) {
            setData([response.data]);
          }
          break;
        default:
          response = await api.getTopGainers();
          if (response.data) {
            setData(response.data["top_gainers"] || []);
          }
      }

      if (response?.error) {
        setError(response.error);
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-red-600 dark:text-red-400">
        <AlertCircle size={32} className="mb-2" />
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
        <p>No data available</p>
      </div>
    );
  }

  const renderCard = (item: any, index: number) => {
    const symbol = extractNestedValue(item, "symbol") || 
                   extractNestedValue(item, "01. symbol") ||
                   extractNestedValue(item, "Symbol") ||
                   `Item ${index + 1}`;
    
    const price = extractNestedValue(item, "price") ||
                  extractNestedValue(item, "05. price") ||
                  extractNestedValue(item, "Price") ||
                  "N/A";
    
    const change = extractNestedValue(item, "change") ||
                   extractNestedValue(item, "09. change") ||
                   extractNestedValue(item, "Change") ||
                   "0";
    
    const changePercent = extractNestedValue(item, "change_percent") ||
                          extractNestedValue(item, "10. change percent") ||
                          extractNestedValue(item, "ChangePercent") ||
                          "0%";

    const changeNum = parseFloat(String(change).replace("%", ""));
    const isPositive = changeNum >= 0;
    const TrendIcon = isPositive ? TrendingUp : changeNum < 0 ? TrendingDown : Minus;

    return (
      <div
        key={index}
        className="p-4 border border-gray-200/50 dark:border-slate-700/50 rounded-xl bg-gradient-to-br from-white to-gray-50 dark:from-slate-800/50 dark:to-slate-900/50 mb-3 hover:shadow-md transition-all duration-200"
      >
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-1">{symbol}</h4>
            <p className="text-base font-semibold text-gray-700 dark:text-gray-300">
              {formatValue(price, "currency")}
            </p>
          </div>
          <div className={`flex items-center gap-2 ${isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
            <div className={`p-2 rounded-lg ${isPositive ? "bg-emerald-50 dark:bg-emerald-900/20" : "bg-red-50 dark:bg-red-900/20"}`}>
              <TrendIcon size={18} />
            </div>
            <div className="text-right">
              <p className="font-bold text-sm">{formatValue(change, "currency")}</p>
              <p className="text-xs font-medium">{changePercent}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-2 max-h-96 overflow-y-auto">
      {data.map((item, index) => renderCard(item, index))}
    </div>
  );
}


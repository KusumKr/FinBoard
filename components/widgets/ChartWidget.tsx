"use client";

import { useEffect, useState } from "react";
import { WidgetConfig } from "@/store/dashboardStore";
import { FinanceAPI } from "@/lib/api/financeApi";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Loader2, AlertCircle } from "lucide-react";
import CandlestickChart from "./CandlestickChart";

interface ChartWidgetProps {
  widget: WidgetConfig;
}

export default function ChartWidget({ widget }: ChartWidgetProps) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [symbol, setSymbol] = useState("AAPL");

  useEffect(() => {
    fetchData();
    if (widget.refreshInterval) {
      const interval = setInterval(fetchData, widget.refreshInterval);
      return () => clearInterval(interval);
    }
  }, [widget.apiEndpoint, widget.apiKey, widget.chartInterval, symbol]);

  const fetchData = async () => {
    const api = new FinanceAPI(widget.apiKey);
    setLoading(true);
    setError(null);

    try {
      const interval = widget.chartInterval || "daily";
      const response = await api.getTimeSeries(symbol, interval);

      if (response.error) {
        setError(response.error);
      } else if (response.data) {
        const timeSeriesKey = Object.keys(response.data).find(
          (key) => key.includes("Time Series") || key.includes("Weekly") || key.includes("Monthly")
        );

        if (timeSeriesKey) {
          const timeSeries = response.data[timeSeriesKey];
          const chartData = Object.entries(timeSeries)
            .map(([date, values]: [string, any]) => ({
              date: new Date(date).toLocaleDateString(),
              open: parseFloat(values["1. open"] || values["Open"] || "0"),
              high: parseFloat(values["2. high"] || values["High"] || "0"),
              low: parseFloat(values["3. low"] || values["Low"] || "0"),
              close: parseFloat(values["4. close"] || values["Close"] || "0"),
              volume: parseFloat(values["5. volume"] || values["Volume"] || "0"),
            }))
            .reverse()
            .slice(-30); // Last 30 data points

          setData(chartData);
        } else {
          setError("Invalid data format");
        }
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

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 flex-wrap">
        <input
          type="text"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value.toUpperCase())}
          placeholder="Enter symbol (e.g., AAPL)"
          className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
        />
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {widget.chartInterval || "daily"} interval
        </span>
        {widget.chartType === "candle" && (
          <span className="text-xs px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded">
            Candlestick
          </span>
        )}
      </div>

      {widget.chartType === "candle" ? (
        <div className="w-full" style={{ height: "300px" }}>
          <CandlestickChart data={data} width={800} height={300} />
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="date"
              stroke="#6b7280"
              tick={{ fill: "#6b7280", fontSize: 12 }}
            />
            <YAxis stroke="#6b7280" tick={{ fill: "#6b7280", fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
              }}
            />
            <Line
              type="monotone"
              dataKey="close"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={false}
              name="Close Price"
            />
            <Line
              type="monotone"
              dataKey="open"
              stroke="#10b981"
              strokeWidth={1}
              dot={false}
              name="Open Price"
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}


"use client";

import { useState, useEffect } from "react";
import { WidgetConfig, useDashboardStore } from "@/store/dashboardStore";
import { FinanceAPI } from "@/lib/api/financeApi";
import { getFieldPaths, flattenObject } from "@/lib/utils/dataMapper";
import { X, Loader2, AlertCircle, Save } from "lucide-react";

interface WidgetConfigPanelProps {
  widget: WidgetConfig;
  onClose: () => void;
}

export default function WidgetConfigPanel({
  widget,
  onClose,
}: WidgetConfigPanelProps) {
  const { updateWidget } = useDashboardStore();
  const [title, setTitle] = useState(widget.title);
  const [apiEndpoint, setApiEndpoint] = useState(widget.apiEndpoint || "");
  const [apiKey, setApiKey] = useState(widget.apiKey || "");
  const [refreshInterval, setRefreshInterval] = useState(
    widget.refreshInterval || 60000
  );
  const [previewData, setPreviewData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [availableFields, setAvailableFields] = useState<string[]>([]);
  const [selectedFields, setSelectedFields] = useState<string[]>(
    widget.selectedFields || []
  );
  const [chartType, setChartType] = useState(widget.chartType || "line");
  const [chartInterval, setChartInterval] = useState(
    widget.chartInterval || "daily"
  );

  useEffect(() => {
    if (widget.data) {
      setPreviewData(widget.data);
      const fields = getFieldPaths(widget.data);
      setAvailableFields(fields);
    }
  }, [widget.data]);

  const fetchPreview = async () => {
    if (!apiEndpoint && widget.type !== "chart") {
      setError("Please provide an API endpoint");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const api = new FinanceAPI(apiKey);
      let response;

      if (apiEndpoint) {
        response = await api.fetchData(apiEndpoint);
      } else if (widget.type === "chart") {
        response = await api.getTimeSeries("AAPL", chartInterval as any);
      } else {
        response = await api.getTopGainers();
      }

      if (response.error) {
        setError(response.error);
      } else if (response.data) {
        setPreviewData(response.data);
        const dataArray = Array.isArray(response.data)
          ? response.data
          : [response.data];
        if (dataArray.length > 0) {
          const fields = getFieldPaths(dataArray[0]);
          setAvailableFields(fields);
        }
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch preview");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    updateWidget(widget.id, {
      title,
      apiEndpoint: apiEndpoint || undefined,
      apiKey: apiKey || undefined,
      refreshInterval,
      selectedFields: selectedFields.length > 0 ? selectedFields : undefined,
      chartType: widget.type === "chart" ? chartType : undefined,
      chartInterval: widget.type === "chart" ? chartInterval : undefined,
      data: previewData,
    });
    onClose();
  };

  const toggleField = (field: string) => {
    setSelectedFields((prev) =>
      prev.includes(field)
        ? prev.filter((f) => f !== field)
        : [...prev, field]
    );
  };

  const renderPreview = () => {
    if (!previewData) return null;

    if (Array.isArray(previewData)) {
      return (
        <div className="max-h-64 overflow-y-auto">
          <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-3 rounded">
            {JSON.stringify(previewData.slice(0, 2), null, 2)}
          </pre>
        </div>
      );
    }

    return (
      <div className="max-h-64 overflow-y-auto">
        <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-3 rounded">
          {JSON.stringify(previewData, null, 2)}
        </pre>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Configure Widget
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Widget Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              API Endpoint
            </label>
            <input
              type="text"
              value={apiEndpoint}
              onChange={(e) => setApiEndpoint(e.target.value)}
              placeholder="https://www.alphavantage.co/query"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              API Key
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter API key"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Refresh Interval (ms)
            </label>
            <input
              type="number"
              value={refreshInterval}
              onChange={(e) => setRefreshInterval(Number(e.target.value))}
              min="1000"
              step="1000"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          {widget.type === "chart" && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Chart Type
                </label>
                <select
                  value={chartType}
                  onChange={(e) => setChartType(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="line">Line Chart</option>
                  <option value="candle">Candlestick Chart</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Time Interval
                </label>
                <select
                  value={chartInterval}
                  onChange={(e) => setChartInterval(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
            </>
          )}

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Preview Data & Field Selection
              </label>
              <button
                onClick={fetchPreview}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors text-sm"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  "Fetch Preview"
                )}
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2 text-red-600 dark:text-red-400">
                <AlertCircle size={16} />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {previewData && (
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Available Fields
                  </h4>
                  <div className="max-h-48 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg p-3 space-y-2">
                    {availableFields.map((field) => (
                      <label
                        key={field}
                        className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded"
                      >
                        <input
                          type="checkbox"
                          checked={selectedFields.includes(field)}
                          onChange={() => toggleField(field)}
                          className="rounded"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {field}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Data Preview
                  </h4>
                  {renderPreview()}
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <Save size={18} />
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


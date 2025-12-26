"use client";

import { useEffect, useState, useMemo } from "react";
import { WidgetConfig } from "@/store/dashboardStore";
import { FinanceAPI } from "@/lib/api/financeApi";
import { extractNestedValue, formatValue, getFieldPaths } from "@/lib/utils/dataMapper";
import { Search, Loader2, AlertCircle, Filter, X, ArrowUpDown } from "lucide-react";

interface TableWidgetProps {
  widget: WidgetConfig;
}

export default function TableWidget({ widget }: TableWidgetProps) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [displayFields, setDisplayFields] = useState<string[]>([]);
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchData();
    if (widget.refreshInterval) {
      const interval = setInterval(fetchData, widget.refreshInterval);
      return () => clearInterval(interval);
    }
  }, [widget.apiEndpoint, widget.apiKey, widget.selectedFields]);

  const fetchData = async () => {
    if (!widget.apiEndpoint) {
      // Use default Alpha Vantage API
      const api = new FinanceAPI(widget.apiKey);
      setLoading(true);
      setError(null);

      try {
        // Fetch top gainers as default
        const response = await api.getTopGainers();
        if (response.error) {
          setError(response.error);
        } else if (response.data) {
          const topGainers = response.data["top_gainers"] || [];
          setData(topGainers);
          
          if (topGainers.length > 0 && !widget.selectedFields) {
            const fields = getFieldPaths(topGainers[0]);
            setDisplayFields(fields.slice(0, 5)); // Default to first 5 fields
          } else if (widget.selectedFields) {
            setDisplayFields(widget.selectedFields);
          }
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    } else {
      // Custom API endpoint
      try {
        setLoading(true);
        setError(null);
        const api = new FinanceAPI(widget.apiKey);
        const response = await api.fetchData(widget.apiEndpoint);
        if (response.error) {
          setError(response.error);
        } else if (response.data) {
          const dataArray = Array.isArray(response.data) 
            ? response.data 
            : Object.values(response.data);
          setData(dataArray);
          
          if (dataArray.length > 0 && !widget.selectedFields) {
            const fields = getFieldPaths(dataArray[0]);
            setDisplayFields(fields.slice(0, 5));
          } else if (widget.selectedFields) {
            setDisplayFields(widget.selectedFields);
          }
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    }
  };

  const filteredAndSortedData = useMemo(() => {
    let result = [...data];

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter((item) => {
        return displayFields.some((field) => {
          const value = extractNestedValue(item, field);
          return String(value).toLowerCase().includes(searchLower);
        });
      });
    }

    // Apply column filters
    Object.entries(columnFilters).forEach(([field, filterValue]) => {
      if (filterValue) {
        const filterLower = filterValue.toLowerCase();
        result = result.filter((item) => {
          const value = extractNestedValue(item, field);
          return String(value).toLowerCase().includes(filterLower);
        });
      }
    });

    // Apply sorting
    if (sortField) {
      result.sort((a, b) => {
        const aValue = extractNestedValue(a, sortField);
        const bValue = extractNestedValue(b, sortField);
        const aNum = Number(aValue);
        const bNum = Number(bValue);
        
        if (!isNaN(aNum) && !isNaN(bNum)) {
          return sortDirection === "asc" ? aNum - bNum : bNum - aNum;
        }
        
        const aStr = String(aValue).toLowerCase();
        const bStr = String(bValue).toLowerCase();
        if (sortDirection === "asc") {
          return aStr.localeCompare(bStr);
        }
        return bStr.localeCompare(aStr);
      });
    }

    return result;
  }, [data, searchTerm, columnFilters, sortField, sortDirection, displayFields]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleColumnFilter = (field: string, value: string) => {
    setColumnFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setColumnFilters({});
    setSearchTerm("");
    setSortField(null);
    setCurrentPage(1);
  };

  const paginatedData = filteredAndSortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);

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
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search all columns..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors flex items-center gap-2 ${
            Object.keys(columnFilters).length > 0 || sortField ? "border-emerald-500 dark:border-emerald-500" : ""
          }`}
        >
          <Filter size={18} />
          Filters
        </button>
        {(Object.keys(columnFilters).length > 0 || sortField || searchTerm) && (
          <button
            onClick={clearFilters}
            className="px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 flex items-center gap-1"
          >
            <X size={16} />
            Clear
          </button>
        )}
      </div>

      {showFilters && (
        <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 space-y-3">
          <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Column Filters
          </div>
          <div className="grid grid-cols-2 gap-3">
            {displayFields.map((field) => (
              <div key={field}>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                  {field.split(".").pop()}
                </label>
                <input
                  type="text"
                  value={columnFilters[field] || ""}
                  onChange={(e) => handleColumnFilter(field, e.target.value)}
                  placeholder="Filter..."
                  className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              {displayFields.map((field) => (
                <th
                  key={field}
                  className="text-left py-2 px-3 font-semibold text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group"
                  onClick={() => handleSort(field)}
                >
                  <div className="flex items-center gap-2">
                    <span>{field.split(".").pop()}</span>
                    {sortField === field && (
                      <ArrowUpDown
                        size={14}
                        className={sortDirection === "asc" ? "rotate-180" : ""}
                      />
                    )}
                    {sortField !== field && (
                      <ArrowUpDown size={14} className="opacity-0 group-hover:opacity-50" />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item, idx) => (
              <tr
                key={idx}
                className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                {displayFields.map((field) => (
                  <td key={field} className="py-2 px-3 text-gray-600 dark:text-gray-400">
                    {formatValue(extractNestedValue(item, field))}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Previous
          </button>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}


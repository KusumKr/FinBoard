import axios from "axios";

const CACHE_DURATION = 60000; // 1 minute cache
const cache = new Map<string, { data: any; timestamp: number }>();

interface ApiResponse {
  data?: any;
  error?: string;
}

export class FinanceAPI {
  private baseUrl: string;
  private apiKey: string;

  constructor(apiKey: string = "") {
    this.apiKey = apiKey;
    this.baseUrl = "https://www.alphavantage.co/query";
  }

  private getCacheKey(endpoint: string, params: Record<string, any>): string {
    return `${endpoint}:${JSON.stringify(params)}`;
  }

  private getCached(key: string): any | null {
    const cached = cache.get(key);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }
    cache.delete(key);
    return null;
  }

  private setCache(key: string, data: any): void {
    cache.set(key, { data, timestamp: Date.now() });
  }

  async fetchData(
    endpoint: string,
    params: Record<string, any> = {}
  ): Promise<ApiResponse> {
    try {
      const cacheKey = this.getCacheKey(endpoint, params);
      const cached = this.getCached(cacheKey);
      if (cached) {
        return { data: cached };
      }

      const response = await axios.get(endpoint, {
        params: {
          ...params,
          apikey: this.apiKey || process.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY,
        },
        timeout: 10000,
      });

      if (response.data["Error Message"] || response.data["Note"]) {
        return {
          error: response.data["Error Message"] || response.data["Note"],
        };
      }

      this.setCache(cacheKey, response.data);
      return { data: response.data };
    } catch (error: any) {
      console.error("API Error:", error);
      return {
        error:
          error.response?.data?.message ||
          error.message ||
          "Failed to fetch data",
      };
    }
  }

  async getQuote(symbol: string): Promise<ApiResponse> {
    return this.fetchData(this.baseUrl, {
      function: "GLOBAL_QUOTE",
      symbol: symbol.toUpperCase(),
    });
  }

  async getTimeSeries(
    symbol: string,
    interval: "daily" | "weekly" | "monthly" = "daily"
  ): Promise<ApiResponse> {
    const functionMap = {
      daily: "TIME_SERIES_DAILY",
      weekly: "TIME_SERIES_WEEKLY",
      monthly: "TIME_SERIES_MONTHLY",
    };

    return this.fetchData(this.baseUrl, {
      function: functionMap[interval],
      symbol: symbol.toUpperCase(),
      outputsize: "compact",
    });
  }

  async getTopGainers(): Promise<ApiResponse> {
    return this.fetchData(this.baseUrl, {
      function: "TOP_GAINERS_LOSERS",
    });
  }

  async searchSymbol(keywords: string): Promise<ApiResponse> {
    return this.fetchData(this.baseUrl, {
      function: "SYMBOL_SEARCH",
      keywords: keywords.toUpperCase(),
    });
  }

  async getCompanyOverview(symbol: string): Promise<ApiResponse> {
    return this.fetchData(this.baseUrl, {
      function: "OVERVIEW",
      symbol: symbol.toUpperCase(),
    });
  }
}

// Alternative API using Finnhub (if Alpha Vantage fails)
export class FinnhubAPI {
  private baseUrl: string = "https://finnhub.io/api/v1";
  private apiKey: string;

  constructor(apiKey: string = "") {
    this.apiKey = apiKey || process.env.NEXT_PUBLIC_FINNHUB_API_KEY || "";
  }

  async getQuote(symbol: string): Promise<ApiResponse> {
    try {
      const response = await axios.get(`${this.baseUrl}/quote`, {
        params: {
          symbol: symbol.toUpperCase(),
          token: this.apiKey,
        },
        timeout: 10000,
      });
      return { data: response.data };
    } catch (error: any) {
      return {
        error: error.message || "Failed to fetch data",
      };
    }
  }

  async getCandles(
    symbol: string,
    resolution: "D" | "W" | "M" = "D",
    from?: number,
    to?: number
  ): Promise<ApiResponse> {
    try {
      const response = await axios.get(`${this.baseUrl}/stock/candle`, {
        params: {
          symbol: symbol.toUpperCase(),
          resolution,
          from: from || Math.floor(Date.now() / 1000) - 86400 * 30,
          to: to || Math.floor(Date.now() / 1000),
          token: this.apiKey,
        },
        timeout: 10000,
      });
      return { data: response.data };
    } catch (error: any) {
      return {
        error: error.message || "Failed to fetch data",
      };
    }
  }
}


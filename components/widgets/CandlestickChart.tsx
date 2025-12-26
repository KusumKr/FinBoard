"use client";

import { useMemo } from "react";

interface CandlestickData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

interface CandlestickChartProps {
  data: CandlestickData[];
  width?: number;
  height?: number;
}

export default function CandlestickChart({ data, width = 800, height = 300 }: CandlestickChartProps) {
  const chartData = useMemo(() => {
    if (data.length === 0) return { min: 0, max: 0, range: 0 };
    
    const allValues = data.flatMap(d => [d.high, d.low, d.open, d.close]);
    const min = Math.min(...allValues);
    const max = Math.max(...allValues);
    const range = max - min || 1;
    
    return { min, max, range };
  }, [data]);

  const barWidth = width / data.length - 4;
  const { min, max, range } = chartData;

  const getY = (value: number) => {
    return height - ((value - min) / range) * (height - 40) - 20;
  };

  return (
    <svg width={width} height={height} className="w-full h-full">
      {data.map((item, index) => {
        const x = (index * width) / data.length + 2;
        const isUp = item.close >= item.open;
        const bodyTop = Math.min(item.open, item.close);
        const bodyBottom = Math.max(item.open, item.close);
        const bodyHeight = bodyBottom - bodyTop;
        const bodyY = getY(bodyTop);
        const bodyH = (bodyHeight / range) * (height - 40) || 2;

        return (
          <g key={index}>
            {/* High-Low line */}
            <line
              x1={x + barWidth / 2}
              y1={getY(item.high)}
              x2={x + barWidth / 2}
              y2={getY(item.low)}
              stroke={isUp ? "#10b981" : "#ef4444"}
              strokeWidth={1}
            />
            {/* Body rectangle */}
            <rect
              x={x}
              y={bodyY}
              width={barWidth}
              height={Math.max(bodyH, 2)}
              fill={isUp ? "#10b981" : "#ef4444"}
              stroke={isUp ? "#059669" : "#dc2626"}
              strokeWidth={0.5}
            />
          </g>
        );
      })}
    </svg>
  );
}


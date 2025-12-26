"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useDashboardStore } from "@/store/dashboardStore";
import { X, Settings, GripVertical, Maximize2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import TableWidget from "./widgets/TableWidget";
import CardWidget from "./widgets/CardWidget";
import ChartWidget from "./widgets/ChartWidget";
import WidgetConfigPanel from "./WidgetConfigPanel";
import { WidgetConfig } from "@/store/dashboardStore";

interface WidgetContainerProps {
  widget: WidgetConfig;
}

export default function WidgetContainer({ widget }: WidgetContainerProps) {
  const { removeWidget, updateWidget } = useDashboardStore();
  const [showConfig, setShowConfig] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState<string>("");
  const widgetRef = useRef<HTMLDivElement>(null);
  const resizeStartRef = useRef({ x: 0, y: 0, width: 0, height: 0 });
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: widget.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isResizing ? "none" : transition,
    opacity: isDragging ? 0.5 : 1,
    width: widget.width ? `${widget.width}px` : "100%",
    height: widget.height ? `${widget.height}px` : "auto",
    minHeight: widget.height ? `${widget.height}px` : "250px",
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing || !resizeDirection) return;

      const deltaX = e.clientX - resizeStartRef.current.x;
      const deltaY = e.clientY - resizeStartRef.current.y;

      let newWidth = resizeStartRef.current.width;
      let newHeight = resizeStartRef.current.height;

      if (resizeDirection.includes("e")) {
        newWidth = Math.max(300, resizeStartRef.current.width + deltaX);
      }
      if (resizeDirection.includes("w")) {
        newWidth = Math.max(300, resizeStartRef.current.width - deltaX);
      }
      if (resizeDirection.includes("s")) {
        newHeight = Math.max(250, resizeStartRef.current.height + deltaY);
      }
      if (resizeDirection.includes("n")) {
        newHeight = Math.max(250, resizeStartRef.current.height - deltaY);
      }

      updateWidget(widget.id, {
        width: newWidth,
        height: newHeight,
      });
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      setResizeDirection("");
    };

    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isResizing, resizeDirection, widget.id, updateWidget]);

  const handleResizeStart = (e: React.MouseEvent, direction: string) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    setResizeDirection(direction);
    if (widgetRef.current) {
      const rect = widgetRef.current.getBoundingClientRect();
      resizeStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        width: widget.width || rect.width,
        height: widget.height || rect.height,
      };
    }
  };

  const renderWidget = () => {
    switch (widget.type) {
      case "table":
        return <TableWidget widget={widget} />;
      case "card":
        return <CardWidget widget={widget} />;
      case "chart":
        return <ChartWidget widget={widget} />;
      default:
        return <div>Unknown widget type</div>;
    }
  };

  return (
    <>
      <div
        ref={(node) => {
          setNodeRef(node);
          if (node) {
            (widgetRef as any).current = node;
          }
        }}
        style={style}
        className="bg-white dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-slate-700/50 p-5 relative group hover:shadow-2xl hover:border-emerald-500/30 dark:hover:border-emerald-500/20 transition-all duration-300"
      >
        {/* Resize handles */}
        <div
          className="absolute top-0 right-0 w-4 h-4 cursor-se-resize opacity-0 group-hover:opacity-100 transition-opacity z-10"
          onMouseDown={(e) => handleResizeStart(e, "se")}
        />
        <div
          className="absolute top-0 left-0 w-4 h-4 cursor-sw-resize opacity-0 group-hover:opacity-100 transition-opacity z-10"
          onMouseDown={(e) => handleResizeStart(e, "sw")}
        />
        <div
          className="absolute bottom-0 right-0 w-4 h-4 cursor-ne-resize opacity-0 group-hover:opacity-100 transition-opacity z-10"
          onMouseDown={(e) => handleResizeStart(e, "ne")}
        />
        <div
          className="absolute bottom-0 left-0 w-4 h-4 cursor-nw-resize opacity-0 group-hover:opacity-100 transition-opacity z-10"
          onMouseDown={(e) => handleResizeStart(e, "nw")}
        />
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-2 cursor-n-resize opacity-0 group-hover:opacity-100 transition-opacity z-10"
          onMouseDown={(e) => handleResizeStart(e, "n")}
        />
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-2 cursor-s-resize opacity-0 group-hover:opacity-100 transition-opacity z-10"
          onMouseDown={(e) => handleResizeStart(e, "s")}
        />
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-8 cursor-w-resize opacity-0 group-hover:opacity-100 transition-opacity z-10"
          onMouseDown={(e) => handleResizeStart(e, "w")}
        />
        <div
          className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-8 cursor-e-resize opacity-0 group-hover:opacity-100 transition-opacity z-10"
          onMouseDown={(e) => handleResizeStart(e, "e")}
        />
        <div className="flex items-center justify-between mb-5 pb-4 border-b border-gray-100 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <button
              {...attributes}
              {...listeners}
              className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              <GripVertical size={18} />
            </button>
            <h3 className="font-bold text-lg text-gray-900 dark:text-white">
              {widget.title}
            </h3>
          </div>
          
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => {
                updateWidget(widget.id, { width: undefined, height: undefined });
              }}
              className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all"
              title="Reset Size"
            >
              <Maximize2 size={16} />
            </button>
            <button
              onClick={() => setShowConfig(true)}
              className="p-2 text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-all"
              title="Configure"
            >
              <Settings size={16} />
            </button>
            <button
              onClick={() => removeWidget(widget.id)}
              className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
              title="Remove"
            >
              <X size={16} />
            </button>
          </div>
        </div>
        
        <div className="min-h-[250px]">{renderWidget()}</div>
      </div>

      {showConfig && (
        <WidgetConfigPanel
          widget={widget}
          onClose={() => setShowConfig(false)}
        />
      )}
    </>
  );
}


"use client";

import { useDashboardStore } from "@/store/dashboardStore";
import WidgetContainer from "./WidgetContainer";
import Header from "./Header";
import AddWidgetModal from "./AddWidgetModal";
import { useState } from "react";
import { Plus } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from "@dnd-kit/sortable";

export default function Dashboard() {
  const { widgets, reorderWidgets, theme } = useDashboardStore();
  const [showAddModal, setShowAddModal] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = widgets.findIndex((w) => w.id === active.id);
      const newIndex = widgets.findIndex((w) => w.id === over.id);
      reorderWidgets(oldIndex, newIndex);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors">
      <Header onAddWidget={() => setShowAddModal(true)} />
      
      <div className="container mx-auto px-6 py-8">
        {widgets.length === 0 ? (
          <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
            <div className="text-center max-w-md">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                Build Your Finance Dashboard
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
                Connect to a finance API and create a custom widget to get started
              </p>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-8 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 font-semibold text-lg"
              >
                Add Your First Widget
              </button>
            </div>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={widgets.map((w) => w.id)}
              strategy={rectSortingStrategy}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-min">
                {widgets.map((widget) => (
                  <WidgetContainer key={widget.id} widget={widget} />
                ))}
                {/* Add Widget Card */}
                <button
                  onClick={() => setShowAddModal(true)}
                  className="min-h-[300px] bg-white dark:bg-slate-800/50 rounded-2xl border-2 border-dashed border-gray-300 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-500 transition-all duration-200 flex flex-col items-center justify-center group"
                >
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-600/20 dark:from-emerald-500/10 dark:to-teal-600/10 flex items-center justify-center mb-4 group-hover:from-emerald-500/30 group-hover:to-teal-600/30 transition-all">
                    <Plus size={32} className="text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 font-semibold mb-2">Add Widget</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center px-4">
                    Connect to a finance API and create a custom widget
                  </p>
                </button>
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>

      {showAddModal && (
        <AddWidgetModal onClose={() => setShowAddModal(false)} />
      )}
    </div>
  );
}


import { useState } from "react";
import type { Preset } from "../types";

interface PresetItemProps {
  preset: Preset;
  onLoad: () => void;
  onDelete: () => void;
}

// Displays a saved preset that can be loaded, dragged to canvas, or deleted
export default function PresetItem({
  preset,
  onLoad,
  onDelete,
}: PresetItemProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Make preset draggable to canvas
  const onDragStart: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.dataTransfer.setData("application/preset", JSON.stringify(preset));
  };

  // Handle delete with confirmation
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (showDeleteConfirm) {
      onDelete();
      setShowDeleteConfirm(false);
    } else {
      setShowDeleteConfirm(true);
      setTimeout(() => setShowDeleteConfirm(false), 3000);
    }
  };

  return (
    <div
      className="relative w-[191px] h-[46px] bg-[#1E2939] border border-[#364153] rounded-lg cursor-pointer select-none hover:bg-[#252F3F] transition-colors"
      draggable
      onDragStart={onDragStart}
      onClick={onLoad}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="button"
      aria-label={`Load preset ${preset.name}`}
    >
      <div className="flex items-center justify-between h-full px-3">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-8 h-8 rounded-md bg-blue-600/20 flex items-center justify-center">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#60A5FA"
              strokeWidth="2"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>
          <div className="text-sm text-[#E5E7EB] font-normal truncate">
            {preset.name}
          </div>
        </div>

        <button
          onClick={handleDelete}
          className={`ml-2 w-6 h-6 rounded flex items-center justify-center transition-all ${
            showDeleteConfirm
              ? "bg-red-600 text-white"
              : "text-gray-400 hover:text-red-500 hover:bg-red-500/10"
          }`}
          aria-label={showDeleteConfirm ? "Confirm delete" : "Delete preset"}
          title={showDeleteConfirm ? "Click again to confirm" : "Delete"}
        >
          {showDeleteConfirm ? (
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          )}
        </button>
      </div>

      {/* Tooltip */}
      {isHovered && !showDeleteConfirm && (
        <div
          className="absolute left-full ml-3 top-1/2 pointer-events-none transition-all duration-300 ease-out z-50"
          style={{
            transform: "translateY(-50%)",
          }}
        >
          <div className="text-[#F3F4F6] bg-[#2B7FFF] rounded-lg px-4 py-2 shadow-lg whitespace-nowrap text-sm font-medium relative flex items-center justify-center">
            Click to load or drag to canvas
            <div
              className="absolute right-full top-1/2 -translate-y-1/2"
              style={{
                width: 0,
                height: 0,
                borderTop: "6px solid transparent",
                borderBottom: "6px solid transparent",
                borderRight: "6px solid #2B7FFF",
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

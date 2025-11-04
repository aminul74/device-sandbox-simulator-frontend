import React, { useRef, useState } from "react";
import type { PlacedDevice as PD, DeviceType } from "../types";
import PlacedDevice from "./PlacedDevice";

export default function Canvas() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [items, setItems] = useState<PD[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const raw = e.dataTransfer.getData("application/device");
    if (!raw) return;
    try {
      const payload = JSON.parse(raw) as { type: DeviceType };
      const rect = containerRef.current!.getBoundingClientRect();
      const x = e.clientX - rect.left - 40; // center offset
      const y = e.clientY - rect.top - 40;
      const base: PD = {
        id: `${Date.now()}-${Math.random()}`,
        type: payload.type,
        x: Math.max(0, x),
        y: Math.max(0, y),
      };
      const newItem: PD =
        payload.type === "light"
          ? { ...base, power: true, brightness: 70, color: "#ffdca6" }
          : { ...base, power: true, speed: 60 };
      setItems((s) => [...s, newItem]);
      setSelectedId(newItem.id);
    } catch {
      // ignore malformed payload
    }
  }

  function moveItem(id: string, x: number, y: number) {
    setItems((s) => s.map((it) => (it.id === id ? { ...it, x, y } : it)));
  }

  function updateItem(id: string, patch: Partial<PD>) {
    setItems((s) => s.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  }

  function clearCanvas() {
    setItems([]);
    setSelectedId(null);
  }

  function savePreset() {
    try {
      const existing = JSON.parse(localStorage.getItem("presets") || "[]");
      existing.push({ id: Date.now(), items });
      localStorage.setItem("presets", JSON.stringify(existing));
      setToast("Preset saved");
      setTimeout(() => setToast(null), 2000);
    } catch {
      setToast("Failed to save");
      setTimeout(() => setToast(null), 2000);
    }
  }

  const selected = items.find((it) => it.id === selectedId) ?? null;

  return (
    <div className="flex-1 p-6 bg-[#030712]">
      <div className="text-base font-normal text-[#F3F4F6] mb-3">
        Testing Canvas
      </div>
      <div className="relative w-full h-full mx-auto">
        <div
          ref={containerRef}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className="relative w-full h-full rounded-xl bg-[#10182880] border border-[#1E2939] shadow-lg overflow-hidden"
        >
          {/* top-right actions */}
          <div className="absolute right-4 top-4 flex gap-3">
            <button
              onClick={clearCanvas}
              className="bg-[#0b1620] text-white/80 px-3 py-1 rounded-md border border-white/6 text-sm"
            >
              Clear
            </button>
            <button
              onClick={savePreset}
              className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm shadow"
            >
              Save Preset
            </button>
          </div>

          {items.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center text-white/30">
              Drag anything here
            </div>
          )}

          {items.map((it) => (
            <PlacedDevice
              key={it.id}
              item={it}
              onMove={moveItem}
              onSelect={(id) => setSelectedId(id)}
              selected={selectedId === it.id}
            />
          ))}

          {/* bottom-center controls card */}
          {selected && (
            <div className="absolute left-1/2 -translate-x-1/2 bottom-6 w-[560px] bg-[#081123]/80 border border-white/5 rounded-xl p-4 shadow-lg">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="text-white/90 text-sm font-medium">
                      {selected.type === "light" ? "Power" : "Power"}
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!!selected.power}
                        onChange={(e) =>
                          updateItem(selected.id, { power: e.target.checked })
                        }
                        className="sr-only"
                      />
                      <div className="w-10 h-6 bg-gray-600 rounded-full shadow-inner flex items-center p-1">
                        <div
                          className={`w-4 h-4 rounded-full bg-white transition-transform ${
                            selected.power ? "translate-x-4" : ""
                          }`}
                        />
                      </div>
                    </label>
                  </div>

                  {selected.type === "light" ? (
                    <div className="mt-3">
                      <div className="text-xs text-white/70 mb-2">
                        Color Temperature
                      </div>
                      <div className="flex gap-2">
                        {["#ffdca6", "#f7fbff", "#aee7ff", "#ffccd7"].map(
                          (c) => (
                            <button
                              key={c}
                              onClick={() =>
                                updateItem(selected.id, { color: c })
                              }
                              style={{ background: c }}
                              className={`w-10 h-8 rounded-md border ${
                                selected.color === c
                                  ? "ring-2 ring-white/30"
                                  : "border-white/8"
                              }`}
                            />
                          )
                        )}
                        {/* color picker for arbitrary color */}
                        <div className="mt-3 flex items-center gap-3">
                          <div className="text-xs text-white/70">Custom</div>
                          <input
                            type="color"
                            value={selected.color ?? "#ffdca6"}
                            onChange={(e) =>
                              updateItem(selected.id, { color: e.target.value })
                            }
                            className="w-10 h-8 p-0 border rounded"
                            aria-label="Choose light color"
                          />
                          <div
                            className="w-8 h-8 rounded-md border"
                            style={{ background: selected.color ?? "#ffdca6" }}
                          />
                        </div>
                      </div>

                      <div className="mt-3 flex items-center gap-3">
                        <div className="text-xs text-white/60">Brightness</div>
                        <input
                          type="range"
                          min={0}
                          max={100}
                          value={selected.brightness ?? 70}
                          onChange={(e) =>
                            updateItem(selected.id, {
                              brightness: Number(e.target.value),
                            })
                          }
                          className="flex-1"
                        />
                        <div className="text-xs text-white/60 w-10 text-right">
                          {selected.brightness ?? 70}%
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-3">
                      <div className="text-xs text-white/70 mb-2">Speed</div>
                      <div className="flex items-center gap-3">
                        <input
                          type="range"
                          min={0}
                          max={100}
                          value={selected.speed ?? 60}
                          onChange={(e) =>
                            updateItem(selected.id, {
                              speed: Number(e.target.value),
                            })
                          }
                          className="flex-1"
                        />
                        <div className="text-xs text-white/60 w-10 text-right">
                          {selected.speed ?? 60}%
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="w-36" />
              </div>
            </div>
          )}
        </div>

        {/* toast */}
        {toast && (
          <div className="absolute left-1/2 -translate-x-1/2 -translate-y-4 top-0 bg-green-600 text-white px-4 py-2 rounded shadow-md">
            {toast}
          </div>
        )}
      </div>
    </div>
  );
}

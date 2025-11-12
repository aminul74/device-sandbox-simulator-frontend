import React, { useRef, useState } from "react";
import type { PlacedDevice as PD, DeviceType, Preset } from "../types";
import PlacedDevice from "./PlacedDevice";
import PresetDialog from "./PresetDialog";
import { useDeviceContext } from "../context/useDeviceContext";

export default function Canvas() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const {
    devices: items,
    setDevices,
    addDevice,
    updateDevice: updateItem,
    clearDevices,
    selectedDeviceId,
    setSelectedDeviceId,
    savePreset,
    loading,
  } = useDeviceContext();

  const [showPresetDialog, setShowPresetDialog] = useState(false);

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();

    // Check if it's a preset being dropped
    const presetData = e.dataTransfer.getData("application/preset");
    if (presetData) {
      try {
        const preset = JSON.parse(presetData) as Preset;
        setDevices(preset.devices);
        setSelectedDeviceId(null);
        return;
      } catch {
        console.error("Failed to parse dropped preset data");
      }
    }

    // Otherwise, it's a device being dropped
    const raw = e.dataTransfer.getData("application/device");
    if (!raw) return;
    try {
      const payload = JSON.parse(raw) as { type: DeviceType };
      const rect = containerRef.current!.getBoundingClientRect();
      const x = e.clientX - rect.left - 40;
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
      addDevice(newItem);
    } catch {
      console.error("Failed to parse dropped device data");
    }
  }

  function moveItem(id: string, x: number, y: number) {
    updateItem(id, { x, y });
  }

  function handleSavePreset() {
    if (items.length === 0) {
      return;
    }
    setShowPresetDialog(true);
  }

  async function handlePresetSave(name: string) {
    await savePreset(name);
    setShowPresetDialog(false);
  }

  const selected = items.find((it) => it.id === selectedDeviceId) ?? null;

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
              onClick={() => clearDevices()}
              className="bg-[#0b1620] text-white/80 px-3 py-1 rounded-md border border-white/6 text-sm hover:bg-[#1E2939] transition-colors"
            >
              Clear
            </button>
            <button
              onClick={handleSavePreset}
              disabled={items.length === 0 || loading}
              className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm shadow hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Saving..." : "Save Preset"}
            </button>
          </div>

          {items.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center text-white/30 text-lg">
              Drag devices here to get started
            </div>
          )}

          {items.map((it) => (
            <PlacedDevice
              key={it.id}
              item={it}
              onMove={moveItem}
              onSelect={(id) => setSelectedDeviceId(id)}
            />
          ))}

          {/* bottom-center controls card */}
          {selected && (
            <div className="absolute left-1/2 -translate-x-1/2 bottom-6 w-[560px] bg-[#0b1526]/90 border border-white/5 rounded-2xl p-5 shadow-xl backdrop-blur-sm">
              <div>
                <div>
                  <div className="flex items-center justify-between">
                    <div className="text-white/90 text-base font-medium">
                      Power
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={!!selected.power}
                        onChange={(e) =>
                          updateItem(selected.id, { power: e.target.checked })
                        }
                        className="sr-only"
                        aria-label="Toggle power"
                      />
                      <div
                        className={`w-12 h-7 rounded-full p-1 transition-colors duration-200 flex items-center ${
                          selected.power ? "bg-[#2B7FFF]" : "bg-[#2A3441]"
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                            selected.power ? "translate-x-5" : "translate-x-0"
                          }`}
                        />
                      </div>
                    </label>
                  </div>

                  {selected.type === "light" ? (
                    <div className="mt-3">
                      <div className="text-[15px] text-white/80 mb-3">
                        Color Temperature
                      </div>
                      <div className="flex items-center gap-4">
                        {["#ffdca6", "#f7fbff", "#aee7ff", "#ffccd7"].map(
                          (c) => (
                            <button
                              key={c}
                              onClick={() =>
                                updateItem(selected.id, { color: c })
                              }
                              style={{ background: c }}
                              aria-pressed={selected.color === c}
                              className={`w-[120px] h-[68px] rounded-xl border transition-all duration-200 shadow-sm ${
                                selected.color === c
                                  ? "ring-2 ring-[#2B7FFF] border-[#2B7FFF] shadow-[0_0_0_4px_rgba(43,127,255,0.15)]"
                                  : "border-white/15 hover:border-white/25"
                              }`}
                            />
                          )
                        )}
                      </div>

                      <div className="mt-5">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-[17px] text-white/85">
                            Brightness
                          </div>
                          <div className="text-[17px] text-white/50">
                            {selected.brightness ?? 70}%
                          </div>
                        </div>
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
                          className="slider w-full"
                          style={{
                            // @ts-expect-error CSS custom property for background fill size
                            "--p": `${selected.brightness ?? 70}%`,
                          }}
                          aria-label="Brightness"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="mt-5">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-[17px] text-white/85">Speed</div>
                        <div className="text-[17px] text-white/50">
                          {selected.speed ?? 60}%
                        </div>
                      </div>
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
                        className="slider w-full"
                        style={{
                          // @ts-expect-error CSS custom property for background fill size
                          "--p": `${selected.speed ?? 60}%`,
                        }}
                        aria-label="Speed"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Preset Dialog */}
        <PresetDialog
          isOpen={showPresetDialog}
          onClose={() => setShowPresetDialog(false)}
          onSave={handlePresetSave}
          loading={loading}
        />
      </div>
    </div>
  );
}

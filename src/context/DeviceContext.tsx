import React, { useState, useEffect, useCallback, createContext } from "react";
import type { ReactNode } from "react";
import type { PlacedDevice, Preset, AvailableDevice } from "../types";
import { presetsApi, devicesApi } from "../services/api";

// Define all values and methods available from the device context
export interface DeviceContextValue {
  devices: PlacedDevice[];
  setDevices: React.Dispatch<React.SetStateAction<PlacedDevice[]>>;
  addDevice: (device: PlacedDevice) => void;
  updateDevice: (id: string, updates: Partial<PlacedDevice>) => void;
  removeDevice: (id: string) => void;
  clearDevices: () => void;
  selectedDeviceId: string | null;
  setSelectedDeviceId: (id: string | null) => void;
  presets: Preset[];
  savePreset: (name: string) => Promise<void>;
  loadPreset: (preset: Preset) => void;
  deletePreset: (id: number) => Promise<void>;
  availableDevices: AvailableDevice[];
  loading: boolean;
  showToast: (message: string, type?: "success" | "error" | "info") => void;
  toast: { message: string; type: "success" | "error" | "info" } | null;
  hasUnsavedChanges: boolean;
}

const DeviceContext = createContext<DeviceContextValue | null>(null);

const DEFAULT_DEVICES: AvailableDevice[] = [
  { type: "light", label: "Light" },
  { type: "fan", label: "Fan" },
];

export const DeviceProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [devices, setDevices] = useState<PlacedDevice[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const [presets, setPresets] = useState<Preset[]>([]);
  const [availableDevices, setAvailableDevices] =
    useState<AvailableDevice[]>(DEFAULT_DEVICES);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);
  const [originalPresetDevices, setOriginalPresetDevices] = useState<
    PlacedDevice[] | null
  >(null);

  // Check if current devices differ from original preset
  // Returns true if there are new changes to save
  const hasUnsavedChanges = React.useMemo(() => {
    if (devices.length === 0) return false;
    if (originalPresetDevices === null) return true;
    if (devices.length !== originalPresetDevices.length) return true;
    return JSON.stringify(devices) !== JSON.stringify(originalPresetDevices);
  }, [devices, originalPresetDevices]);

  const showToast = useCallback(
    (message: string, type: "success" | "error" | "info" = "info") => {
      setToast({ message, type });
      setTimeout(() => setToast(null), 3000);
    },
    []
  );

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [fetchedPresets, fetchedDevices] = await Promise.all([
          presetsApi.getAll(),
          devicesApi.getAll(),
        ]);

        setPresets(fetchedPresets);

        if (fetchedDevices.length > 0) {
          const types = Array.from(new Set(fetchedDevices.map((d) => d.type)));
          setAvailableDevices(
            types.map((type) => ({
              type,
              label: type.charAt(0).toUpperCase() + type.slice(1),
            }))
          );
        }
      } catch {
        showToast("Failed to load data", "error");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [showToast]);

  // Save preset
  const savePreset = useCallback(
    async (name: string) => {
      if (!name.trim()) {
        showToast("Please enter a preset name", "error");
        return;
      }
      if (devices.length === 0) {
        showToast("No devices to save", "error");
        return;
      }

      setLoading(true);
      try {
        const newPreset = await presetsApi.create(name.trim(), devices);
        setPresets((prev) => [newPreset, ...prev]);
        setOriginalPresetDevices(null); // Reset after saving
        showToast(`Preset "${name}" saved`, "success");
      } catch (error) {
        console.error("ERROR SAVING PRESET ZZZZZ:", error);
        showToast("Failed to save preset", "error");
      } finally {
        setLoading(false);
      }
    },
    [devices, showToast]
  );

  // Load preset
  const loadPreset = useCallback(
    (preset: Preset) => {
      if (!Array.isArray(preset.settings)) {
        showToast("Invalid preset data", "error");
        return;
      }
      setDevices(preset.settings);
      setOriginalPresetDevices(preset.settings); // Store original state
      setSelectedDeviceId(null);
      showToast(`Preset "${preset.name}" loaded`, "success");
    },
    [showToast]
  );

  // Delete preset
  const deletePreset = useCallback(
    async (id: number) => {
      setLoading(true);
      try {
        await presetsApi.delete(id);
        setPresets((prev) => prev.filter((p) => p.id !== id));
        showToast("Preset deleted", "success");
      } catch (error) {
        console.error("Error deleting preset:", error);
        showToast("Failed to delete preset", "error");
      } finally {
        setLoading(false);
      }
    },
    [showToast]
  );

  // Add a new device to canvas
  const addDevice = useCallback((device: PlacedDevice) => {
    setDevices((prev) => [...prev, device]);
    setSelectedDeviceId(device.id);
  }, []);

  // Update a device property (position, color, brightness, etc)
  const updateDevice = useCallback(
    (id: string, updates: Partial<PlacedDevice>) => {
      setDevices((prev) =>
        prev.map((d) => (d.id === id ? { ...d, ...updates } : d))
      );
    },
    []
  );

  // Remove a device from canvas
  const removeDevice = useCallback((id: string) => {
    setDevices((prev) => prev.filter((d) => d.id !== id));
    setSelectedDeviceId((sel) => (sel === id ? null : sel));
  }, []);

  // Clear all devices from canvas
  const clearDevices = useCallback(() => {
    setDevices([]);
    setOriginalPresetDevices(null); // Reset tracking
    setSelectedDeviceId(null);
  }, []);

  const value: DeviceContextValue = {
    devices,
    setDevices,
    addDevice,
    updateDevice,
    removeDevice,
    clearDevices,
    selectedDeviceId,
    setSelectedDeviceId,
    presets,
    savePreset,
    loadPreset,
    deletePreset,
    availableDevices,
    loading,
    showToast,
    toast,
    hasUnsavedChanges,
  };

  return (
    <DeviceContext.Provider value={value}>{children}</DeviceContext.Provider>
  );
};

export { DeviceContext };

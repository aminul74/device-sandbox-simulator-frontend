import React, { useState, useEffect, useCallback, createContext } from "react";
import type { ReactNode } from "react";
import type { PlacedDevice, Preset, AvailableDevice } from "../types";
import { presetsApi, devicesApi } from "../services/api";

// Public shape of the context for consumers
export interface DeviceContextValue {
  // Canvas devices
  devices: PlacedDevice[];
  setDevices: React.Dispatch<React.SetStateAction<PlacedDevice[]>>;
  addDevice: (device: PlacedDevice) => void;
  updateDevice: (id: string, updates: Partial<PlacedDevice>) => void;
  removeDevice: (id: string) => void;
  clearDevices: () => void;

  // Selection
  selectedDeviceId: string | null;
  setSelectedDeviceId: (id: string | null) => void;

  // Presets
  presets: Preset[];
  loadPresets: () => Promise<void>;
  savePreset: (name: string) => Promise<void>;
  loadPreset: (preset: Preset) => void;
  deletePreset: (id: number) => Promise<void>;

  // Available device types
  availableDevices: AvailableDevice[];

  // UI state
  loading: boolean;
  error: string | null;
  showToast: (message: string, type?: "success" | "error" | "info") => void;
  toast: { message: string; type: "success" | "error" | "info" } | null;
}

const DeviceContext = createContext<DeviceContextValue | null>(null);

interface DeviceProviderProps {
  children: ReactNode;
}

// Default available device types (used if API is unavailable)
const DEFAULT_DEVICE_TYPES: AvailableDevice[] = [
  { type: "fan", label: "Fan" },
  { type: "light", label: "Light" },
];

export const DeviceProvider: React.FC<DeviceProviderProps> = ({ children }) => {
  // Devices on canvas
  const [devices, setDevices] = useState<PlacedDevice[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);

  // Presets
  const [presets, setPresets] = useState<Preset[]>([]);

  // Available device types
  const [availableDevices, setAvailableDevices] =
    useState<AvailableDevice[]>(DEFAULT_DEVICE_TYPES);

  // UI
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  // Toast helper
  const showToast = useCallback(
    (message: string, type: "success" | "error" | "info" = "info") => {
      setToast({ message, type });
      setTimeout(() => setToast(null), 3000);
    },
    []
  );

  // Initial data load
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      setError(null);

      const [presetsRes, devicesRes] = await Promise.allSettled([
        presetsApi.getAll(),
        devicesApi.getAll(),
      ]);

      if (presetsRes.status === "fulfilled") {
        setPresets(presetsRes.value);
      } else {
        const msg =
          presetsRes.reason instanceof Error
            ? presetsRes.reason.message
            : "Failed to load presets";
        setError(msg);
        showToast(msg, "error");
      }

      if (devicesRes.status === "fulfilled") {
        const uniqueTypes = Array.from(
          new Set(devicesRes.value.map((d) => d.type))
        );
        if (uniqueTypes.length) {
          setAvailableDevices(
            uniqueTypes.map((type) => ({
              type,
              label: type[0]?.toUpperCase() + type.slice(1),
            }))
          );
        }
      }

      setLoading(false);
    };

    init();
  }, [showToast]);

  // Presets
  const loadPresets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setPresets(await presetsApi.getAll());
      showToast("Presets loaded", "success");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to load presets";
      setError(msg);
      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  const savePreset = useCallback(
    async (name: string) => {
      const trimmed = name.trim();
      if (!trimmed) return showToast("Please enter a preset name", "error");
      if (!devices.length) return showToast("No devices to save", "error");

      setLoading(true);
      try {
        const created = await presetsApi.create(trimmed, devices);
        setPresets((prev) => [...prev, created]);
        showToast(`Preset "${trimmed}" saved`, "success");
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Failed to save preset";
        setError(msg);
        showToast(msg, "error");
      } finally {
        setLoading(false);
      }
    },
    [devices, showToast]
  );

  const loadPreset = useCallback(
    (preset: Preset) => {
      setDevices(preset.devices);
      setSelectedDeviceId(null);
      showToast(`Preset "${preset.name}" loaded`, "success");
    },
    [showToast]
  );

  const deletePreset = useCallback(
    async (id: number) => {
      setLoading(true);
      try {
        await presetsApi.delete(id);
        setPresets((prev) => prev.filter((p) => p.id !== id));
        showToast("Preset deleted", "success");
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Failed to delete preset";
        setError(msg);
        showToast(msg, "error");
      } finally {
        setLoading(false);
      }
    },
    [showToast]
  );

  // Devices on canvas
  const addDevice = useCallback((device: PlacedDevice) => {
    setDevices((prev) => [...prev, device]);
    setSelectedDeviceId(device.id);
  }, []);

  const updateDevice = useCallback(
    (id: string, updates: Partial<PlacedDevice>) => {
      setDevices((prev) =>
        prev.map((d) => (d.id === id ? { ...d, ...updates } : d))
      );
    },
    []
  );

  const removeDevice = useCallback((id: string) => {
    setDevices((prev) => prev.filter((d) => d.id !== id));
    setSelectedDeviceId((sel) => (sel === id ? null : sel));
  }, []);

  const clearDevices = useCallback(() => {
    setDevices([]);
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
    loadPresets,
    savePreset,
    loadPreset,
    deletePreset,
    availableDevices,
    loading,
    error,
    showToast,
    toast,
  };

  return (
    <DeviceContext.Provider value={value}>{children}</DeviceContext.Provider>
  );
};

export { DeviceContext };

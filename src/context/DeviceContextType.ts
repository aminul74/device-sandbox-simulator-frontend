import { createContext } from "react";
import type { PlacedDevice, Preset } from "../types";

export interface DeviceContextType {
  // Devices on canvas
  devices: PlacedDevice[];
  setDevices: React.Dispatch<React.SetStateAction<PlacedDevice[]>>;
  addDevice: (device: PlacedDevice) => void;
  updateDevice: (id: string, updates: Partial<PlacedDevice>) => void;
  removeDevice: (id: string) => void;
  clearDevices: () => void;

  // Selected device
  selectedDeviceId: string | null;
  setSelectedDeviceId: (id: string | null) => void;

  // Presets
  presets: Preset[];
  loadPresets: () => Promise<void>;
  savePreset: (name: string) => Promise<void>;
  loadPreset: (preset: Preset) => void;
  deletePreset: (id: number) => Promise<void>;

  // Available devices from API
  availableDevices: PlacedDevice[];

  // UI State
  loading: boolean;
  error: string | null;
  setError: (error: string | null) => void;
  showToast: (message: string, type?: "success" | "error" | "info") => void;
  toast: { message: string; type: "success" | "error" | "info" } | null;
}

export const DeviceContext = createContext<DeviceContextType | undefined>(
  undefined
);

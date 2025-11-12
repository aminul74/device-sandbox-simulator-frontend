import React, { useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { PlacedDevice, Preset } from "../types";
import { presetsApi, devicesApi } from "../services/api";
import { DeviceContext } from "./DeviceContextType";
import type { DeviceContextType } from "./DeviceContextType";

interface DeviceProviderProps {
  children: ReactNode;
}

export const DeviceProvider: React.FC<DeviceProviderProps> = ({ children }) => {
  const [devices, setDevices] = useState<PlacedDevice[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const [presets, setPresets] = useState<Preset[]>([]);
  const [availableDevices, setAvailableDevices] = useState<PlacedDevice[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  // Load presets and available devices on mount
  useEffect(() => {
    const initData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch presets
        const fetchedPresets = await presetsApi.getAll();
        setPresets(fetchedPresets);

        // Fetch available devices
        try {
          const fetchedDevices = await devicesApi.getAll();
          setAvailableDevices(fetchedDevices);
        } catch (deviceErr) {
          console.error("Error loading devices:", deviceErr);
          // If API fails, we can continue without available devices
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load data";
        setError(errorMessage);
        console.error("Error loading data:", err);

        // Fallback to localStorage if API fails
        try {
          const localPresets = localStorage.getItem("presets");
          if (localPresets) {
            setPresets(JSON.parse(localPresets));
          }
        } catch (localErr) {
          console.error("Failed to load from localStorage:", localErr);
        }
      } finally {
        setLoading(false);
      }
    };

    initData();
  }, []);

  const loadPresets = async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedPresets = await presetsApi.getAll();
      setPresets(fetchedPresets);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load presets";
      setError(errorMessage);
      console.error("Error loading presets:", err);

      // Fallback to localStorage if API fails
      try {
        const localPresets = localStorage.getItem("presets");
        if (localPresets) {
          setPresets(JSON.parse(localPresets));
          showToast("Using local presets (API unavailable)", "info");
        }
      } catch (localErr) {
        console.error("Failed to load from localStorage:", localErr);
      }
    } finally {
      setLoading(false);
    }
  };

  const savePreset = async (name: string) => {
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
      const newPreset = await presetsApi.create(name, devices);
      setPresets((prev) => [...prev, newPreset]);

      // Also save to localStorage as backup
      const allPresets = [...presets, newPreset];
      localStorage.setItem("presets", JSON.stringify(allPresets));

      showToast(`Preset "${name}" saved successfully!`, "success");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to save preset";
      setError(errorMessage);
      showToast(errorMessage, "error");

      // Fallback to localStorage
      try {
        const newPreset: Preset = {
          id: Date.now(),
          name,
          devices: [...devices],
          created_at: new Date().toISOString(),
        };
        const allPresets = [...presets, newPreset];
        setPresets(allPresets);
        localStorage.setItem("presets", JSON.stringify(allPresets));
        showToast(`Preset saved locally (API unavailable)`, "info");
      } catch (localErr) {
        console.error("Failed to save to localStorage:", localErr);
      }
    } finally {
      setLoading(false);
    }
  };

  const loadPreset = (preset: Preset) => {
    setDevices(preset.devices);
    setSelectedDeviceId(null);
    showToast(`Preset "${preset.name}" loaded`, "success");
  };

  const deletePreset = async (id: number) => {
    setLoading(true);
    try {
      await presetsApi.delete(id);
      setPresets((prev) => prev.filter((p) => p.id !== id));

      // Also remove from localStorage
      const updatedPresets = presets.filter((p) => p.id !== id);
      localStorage.setItem("presets", JSON.stringify(updatedPresets));

      showToast("Preset deleted successfully", "success");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete preset";
      setError(errorMessage);
      showToast(errorMessage, "error");

      // Fallback to localStorage
      try {
        const updatedPresets = presets.filter((p) => p.id !== id);
        setPresets(updatedPresets);
        localStorage.setItem("presets", JSON.stringify(updatedPresets));
        showToast("Preset deleted locally", "info");
      } catch (localErr) {
        console.error("Failed to delete from localStorage:", localErr);
      }
    } finally {
      setLoading(false);
    }
  };

  const addDevice = (device: PlacedDevice) => {
    setDevices((prev) => [...prev, device]);
    setSelectedDeviceId(device.id);
  };

  const updateDevice = (id: string, updates: Partial<PlacedDevice>) => {
    setDevices((prev) =>
      prev.map((device) =>
        device.id === id ? { ...device, ...updates } : device
      )
    );
  };

  const removeDevice = (id: string) => {
    setDevices((prev) => prev.filter((device) => device.id !== id));
    if (selectedDeviceId === id) {
      setSelectedDeviceId(null);
    }
  };

  const clearDevices = () => {
    setDevices([]);
    setSelectedDeviceId(null);
  };

  const showToast = (
    message: string,
    type: "success" | "error" | "info" = "info"
  ) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const value: DeviceContextType = {
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
    setError,
    showToast,
    toast,
  };

  return (
    <DeviceContext.Provider value={value}>{children}</DeviceContext.Provider>
  );
};

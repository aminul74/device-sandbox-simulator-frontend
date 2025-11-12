import axios from "axios";
import type { Preset, PlacedDevice, ApiResponse } from "../types";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// API Service for managing presets
export const presetsApi = {
  // Get all saved presets
  async getAll(): Promise<Preset[]> {
    const response = await api.get<ApiResponse<Preset[]>>("/presets");
    if (response.data.success && response.data.data) return response.data.data;
    throw new Error(response.data.message || "Failed to fetch presets");
  },

  // Create a new preset
  async create(name: string, devices: PlacedDevice[]): Promise<Preset> {
    const response = await api.post<ApiResponse<Preset>>("/presets", {
      name,
      settings: JSON.stringify(devices),
    });
    if (response.data.success && response.data.data) return response.data.data;
    throw new Error(response.data.message || "Failed to create preset");
  },

  // Delete a preset
  async delete(id: number): Promise<void> {
    const response = await api.delete<ApiResponse<void>>(`/presets/${id}`);
    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to delete preset");
    }
  },
};

// API Service for managing devices
export const devicesApi = {
  // Get all devices
  async getAll(): Promise<PlacedDevice[]> {
    const response = await api.get<ApiResponse<PlacedDevice[]>>("/devices");
    if (response.data.success && response.data.data) return response.data.data;
    throw new Error(response.data.message || "Failed to fetch devices");
  },
};

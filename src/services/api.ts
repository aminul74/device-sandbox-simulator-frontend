import axios from "axios";
import type { Preset, PlacedDevice, ApiResponse } from "../types";

// Get API base URL from environment or use default local backend
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

// Create axios instance with base URL and headers
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Presets API endpoints
export const presetsApi = {
  // Get all saved presets
  async getAll(): Promise<Preset[]> {
    try {
      const { data } = await api.get<ApiResponse<Preset[]>>("/presets");
      return data.data || [];
    } catch (error) {
      console.error("Error fetching presets:", error);
      return [];
    }
  },

  // Create and save a new preset
  async create(name: string, devices: PlacedDevice[]): Promise<Preset> {
    try {
      const { data } = await api.post<ApiResponse<Preset>>("/presets", {
        name,
        settings: devices,
      });
      return data.data!;
    } catch (error) {
      console.error("Error creating preset:", error);
      throw error;
    }
  },

  // Delete a preset by ID
  async delete(id: number): Promise<void> {
    try {
      await api.delete(`/presets/${id}`);
    } catch (error) {
      console.error("Error deleting preset:", error);
      throw error;
    }
  },
};

// Devices API endpoints
export const devicesApi = {
  // Get all available device types
  async getAll(): Promise<PlacedDevice[]> {
    try {
      const { data } = await api.get<ApiResponse<PlacedDevice[]>>("/devices");
      return data.data || [];
    } catch (error) {
      console.error("Error fetching devices:", error);
      return [];
    }
  },
};

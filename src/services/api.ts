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
  /**
   * Get all saved presets
   */
  async getAll(): Promise<Preset[]> {
    try {
      const response = await api.get<ApiResponse<Preset[]>>("/presets");
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      throw new Error(response.data.message || "Failed to fetch presets");
    } catch (error) {
      console.error("Error fetching presets:", error);
      throw error;
    }
  },

  /**
   * Get a single preset by ID
   */
  async getById(id: number): Promise<Preset> {
    try {
      const response = await api.get<ApiResponse<Preset>>(`/presets/${id}`);
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      throw new Error(response.data.message || "Failed to fetch preset");
    } catch (error) {
      console.error("Error fetching preset:", error);
      throw error;
    }
  },

  /**
   * Create a new preset
   */
  async create(name: string, devices: PlacedDevice[]): Promise<Preset> {
    try {
      const response = await api.post<ApiResponse<Preset>>("/presets", {
        name,
        devices: JSON.stringify(devices),
      });
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      throw new Error(response.data.message || "Failed to create preset");
    } catch (error) {
      console.error("Error creating preset:", error);
      throw error;
    }
  },

  /**
   * Update an existing preset
   */
  async update(
    id: number,
    name: string,
    devices: PlacedDevice[]
  ): Promise<Preset> {
    try {
      const response = await api.put<ApiResponse<Preset>>(`/presets/${id}`, {
        name,
        devices: JSON.stringify(devices),
      });
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      throw new Error(response.data.message || "Failed to update preset");
    } catch (error) {
      console.error("Error updating preset:", error);
      throw error;
    }
  },

  /**
   * Delete a preset
   */
  async delete(id: number): Promise<void> {
    try {
      const response = await api.delete<ApiResponse<void>>(`/presets/${id}`);
      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to delete preset");
      }
    } catch (error) {
      console.error("Error deleting preset:", error);
      throw error;
    }
  },
};

// API Service for managing devices
export const devicesApi = {
  /**
   * Get all devices
   * GET /api/devices
   */
  async getAll(): Promise<PlacedDevice[]> {
    try {
      const response = await api.get<ApiResponse<PlacedDevice[]>>("/devices");
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      throw new Error(response.data.message || "Failed to fetch devices");
    } catch (error) {
      console.error("Error fetching devices:", error);
      throw error;
    }
  },

  /**
   * Get a single device by ID
   * GET /api/devices/{id}
   */
  async getById(id: number): Promise<PlacedDevice> {
    try {
      const response = await api.get<ApiResponse<PlacedDevice>>(
        `/devices/${id}`
      );
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      throw new Error(response.data.message || "Failed to fetch device");
    } catch (error) {
      console.error("Error fetching device:", error);
      throw error;
    }
  },

  /**
   * Create a new device
   * POST /api/devices
   */
  async create(device: PlacedDevice): Promise<PlacedDevice> {
    try {
      const response = await api.post<ApiResponse<PlacedDevice>>(
        "/devices",
        device
      );
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      throw new Error(response.data.message || "Failed to create device");
    } catch (error) {
      console.error("Error creating device:", error);
      throw error;
    }
  },

  /**
   * Update an existing device
   * PUT/PATCH /api/devices/{id}
   */
  async update(id: number, device: PlacedDevice): Promise<PlacedDevice> {
    try {
      const response = await api.put<ApiResponse<PlacedDevice>>(
        `/devices/${id}`,
        device
      );
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      throw new Error(response.data.message || "Failed to update device");
    } catch (error) {
      console.error("Error updating device:", error);
      throw error;
    }
  },

  /**
   * Delete a device
   * DELETE /api/devices/{id}
   */
  async delete(id: number): Promise<void> {
    try {
      const response = await api.delete<ApiResponse<void>>(`/devices/${id}`);
      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to delete device");
      }
    } catch (error) {
      console.error("Error deleting device:", error);
      throw error;
    }
  },
};

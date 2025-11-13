// Device Types
export type DeviceType = "light" | "fan";

export interface PlacedDevice {
  id: string;
  type: DeviceType;
  x: number;
  y: number;
  power: boolean;
  // Light properties
  brightness?: number;
  color?: string;
  // Fan properties
  speed?: number;
}

export interface AvailableDevice {
  type: DeviceType;
  label: string;
}

// Preset Types
export interface Preset {
  id: number;
  name: string;
  settings: PlacedDevice[];
  created_at?: string;
  updated_at?: string;
}

// API Response Type
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

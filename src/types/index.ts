export type DeviceType = "light" | "fan";

export interface PlacedDevice {
  id: string;
  type: DeviceType;
  x: number;
  y: number;
  power?: boolean;
  brightness?: number;
  color?: string;
  speed?: number;
}

export interface AvailableDevice {
  type: DeviceType;
  label: string;
}

export interface Preset {
  id: number;
  name: string;
  settings: PlacedDevice[];
  created_at?: string;
  updated_at?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

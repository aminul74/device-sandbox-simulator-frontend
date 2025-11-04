export type DeviceType = "light" | "fan";

export interface PlacedDevice {
  id: string;
  type: DeviceType;
  x: number; // px from left inside canvas
  y: number; // px from top inside canvas
  // optional device settings
  power?: boolean;
  brightness?: number; // 0-100
  color?: string; // hex or named
  speed?: number; // for fan 0-100
}

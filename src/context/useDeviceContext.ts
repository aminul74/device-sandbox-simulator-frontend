import { useContext } from "react";
import { DeviceContext } from "./DeviceContext";
import type { DeviceContextValue } from "./DeviceContext";

export const useDeviceContext = (): DeviceContextValue => {
  const context = useContext(DeviceContext);
  if (!context) {
    throw new Error("useDeviceContext must be used within DeviceProvider");
  }
  return context;
};

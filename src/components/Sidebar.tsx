import { DeviceItem, PresetItem } from "./index";
import { useDeviceContext } from "../context/useDeviceContext";

export default function Sidebar() {
  const { presets, availableDevices, loadPreset, deletePreset, loading } =
    useDeviceContext();

  return (
    <aside className="hidden md:block min-w-[245.5px] border-r border-[#1E2939] bg-[#101828] p-6">
      <h3 className="text-base text-[#F3F4F6] font-normal mb-3">Devices</h3>
      <div className="flex flex-col gap-5 mt-4">
        
        {loading ? (
          <div className="w-[191px] h-[46px] text-base text-[#E5E7EB] p-3 rounded-lg bg-transparent border border-[#364153] flex items-center justify-center">
            Loading...
          </div>
        ) : availableDevices.length > 0 ? (
          availableDevices.map((device) => (
            <DeviceItem
              key={device.type}
              type={device.type}
              label={device.label}
            />
          ))
        ) : (
          <DeviceItem type="light" label="Light" />
        )}
      </div>

      <h3 className="text-base text-[#F3F4F6] font-normal mt-8 mb-2">
        Saved Presets
      </h3>
      <div className="flex flex-col gap-3">
        {presets.length === 0 ? (
          <div className="w-[191px] h-[46px] text-base text-[#E5E7EB] p-3 rounded-lg bg-transparent border border-[#364153] flex items-center justify-center">
            {loading ? "Loading..." : "Nothing added yet"}
          </div>
        ) : (
          presets.map((preset) => (
            <PresetItem
              key={preset.id}
              preset={preset}
              onLoad={() => loadPreset(preset)}
              onDelete={() => deletePreset(preset.id)}
            />
          ))
        )}
      </div>
    </aside>
  );
}

import DeviceItem from "./DeviceItem";

export default function Sidebar() {
  return (
    <aside className="hidden md:block min-w-[245.5px] border-r border-[#1E2939] bg-[#101828] p-6">
      <h3 className="text-base text-[#F3F4F6] font-normal mb-3">Devices</h3>
      <div className="flex flex-col gap-5 mt-4">
        <DeviceItem type="light" label="Light" />
        <DeviceItem type="fan" label="Fan" />
      </div>

      <h3 className="text-base text-[#F3F4F6] font-normal mt-8 mb-2">
        Saved Presets
      </h3>
      <div className="w-[191px] h-[46px] text-base text-[#E5E7EB] p-3 rounded-lg bg-transparent border border-[#364153]">
        Nothing added yet
      </div>
    </aside>
  );
}

import Sidebar from "../components/Sidebar";
import Canvas from "../components/Canvas";
import Toast from "../components/Toast";
import { useDeviceContext } from "../context/useDeviceContext";

export default function Home() {
  const { toast } = useDeviceContext();

  return (
    <div className="min-h-screen bg-[#071021] flex relative">
      <Sidebar />
      <div className="flex-1 flex flex-col bg-[#030712]">
        <Canvas />
      </div>
      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}

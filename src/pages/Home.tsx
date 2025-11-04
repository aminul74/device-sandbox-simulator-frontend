import Sidebar from "../components/Sidebar";
import Canvas from "../components/Canvas";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#071021] flex">
      <Sidebar />
      <div className="flex-1 flex flex-col bg-[#030712]">
        <Canvas />
      </div>
    </div>
  );
}

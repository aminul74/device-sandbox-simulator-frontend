import Home from "./pages/Home";
import { DeviceProvider } from "./context/DeviceContext";

function App() {
  return (
    <DeviceProvider>
      <Home />
    </DeviceProvider>
  );
}

export default App;

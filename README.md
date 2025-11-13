# Device Sandbox Simulator (Frontend)

An interactive React + TypeScript app to drag-and-drop virtual devices (Light and Fan), control them in real-time, and manage preset configurations.

## Quick start

```powershell
# Install dependencies
npm install

# Configure API base URL (optional)
echo VITE_API_URL=http://127.0.0.1:8000/api > .env

# Start the dev server
npm run dev
```

Open http://localhost:5173 in your browser.

## Features

- **Drag-and-drop** - Place devices on canvas by dragging from sidebar
- **Device controls** - Adjust light brightness, color, and fan speed in real-time
- **Preset management** - Save, load, and delete device configurations
- **Visual feedback** - Glow effects for lights and smooth animations
- **Error handling** - Toast notifications for success and error states
- **Responsive design** - Works on desktop and tablet screens
- **Modular architecture** - Easy to extend with new device types

## Scripts

```powershell
npm run dev     # Start dev server with hot reload
npm run build   # Type-check and build for production
npm run lint    # Run ESLint code validation
```

## Architecture overview

### State Management

- **DeviceContext.tsx** — Central state management using React Context
  - Tracks placed devices, selected device, presets
  - Detects unsaved changes for save validation
  - Handles all device and preset operations

### Components (Modular)

- **Canvas.tsx** — Main workspace where devices are placed and controlled
- **PlacedDevice.tsx** — Individual device with drag support and visual effects
- **Sidebar.tsx** — Left panel with draggable device types and saved presets
- **PresetItem.tsx** — Saved preset item (can load or drag to canvas)
- **DeviceItem.tsx** — Available device type (can drag to canvas)
- **PresetDialog.tsx** — Modal for entering preset name when saving
- **Toast.tsx** — Temporary notifications for user feedback

### Services

- **api.ts** — Typed API client with error handling
  - Communicates with backend for presets and devices
  - Try-catch blocks prevent app crashes on API errors

### Types

- **types/index.ts** — Shared TypeScript interfaces for type safety
  - Device types (Light, Fan) with their properties
  - Preset structure for saving configurations

## Configuration

Environment variable:

- `VITE_API_URL` — Backend API endpoint (defaults to http://127.0.0.1:8000/api)

Set this in `.env` file before running the app.

## How to use

1. **Add devices** — Drag device types from sidebar to canvas
2. **Move devices** — Click and drag devices on canvas to reposition
3. **Control devices** — Select a device and adjust its settings (power, color, brightness, speed)
4. **Save preset** — Click "Save Preset" to save current device setup with a name
5. **Load preset** — Click a saved preset to load it or drag it to canvas
6. **Delete preset** — Click delete icon on preset and confirm deletion

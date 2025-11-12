# Device Sandbox Simulator (Frontend)

An interactive React + TypeScript app to drag-and-drop virtual devices (Light and Fan), control them, and manage presets.

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

- Drag-and-drop device placement
- Real-time controls (light color/brightness, fan speed)
- Save / Load / Delete presets
- Toast notifications
- Clean, minimal architecture (Context API)

## Scripts

```powershell
npm run dev     # Start dev server
npm run build   # Type-check and build for production
npm run lint    # Run ESLint
```

## Architecture overview

- src/context/DeviceContext.tsx — single source of truth for app state and actions
- src/components/\* — UI components (Canvas, Sidebar, Items, Dialog, Toast)
- src/services/api.ts — minimal typed API layer for presets and devices
- src/types/index.ts — shared TypeScript types

Environment variable: set VITE_API_URL to point to your backend. If not set, it defaults to http://127.0.0.1:8000/api.

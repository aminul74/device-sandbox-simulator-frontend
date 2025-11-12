# Device Sandbox Simulator - Frontend

A modern, interactive React application for controlling virtual devices (Light and Fan) with drag-and-drop functionality and preset management.

## Quick Start

\\\ash
# Install dependencies
npm install

# Create .env file
echo VITE_API_URL=http://localhost/device-sandbox-api > .env

# Start development server
npm run dev
\\\

Visit http://localhost:5173

## Features

- Drag-and-drop device placement
- Real-time device controls (light brightness/color, fan speed)
- Save/Load/Delete presets
- LocalStorage fallback
- Toast notifications
- Modern UI with animations

## Tech Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS 4
- Axios
- Context API

## Development

\\\ash
npm run dev      # Start dev server
npm run build    # Build for production
npm run lint     # Run ESLint
\\\

See main README for full documentation.

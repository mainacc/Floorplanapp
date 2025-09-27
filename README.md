# PlanKit Monorepo

This repository contains two deliverables that work together to produce editable, RoomPlan-powered floor plans:

1. **plan-kit-pwa** – A Vite + React Progressive Web App that manages projects, imports RoomPlan JSON, stitches rooms, renders an editable Konva canvas, and exports deliverables (PDF/SVG/DXF/CSV).
2. **PlanKitCapture** – A SwiftUI + RoomPlan helper that captures LiDAR rooms on iPhone/iPad and exports JSON that feeds the PWA import flow.

## PlanKit PWA

Navigate to `plan-kit-pwa/` and install dependencies:

```bash
npm install
npm run dev
```

The application is offline-first using Dexie + Workbox, and includes a mock Express server (`server/mockImportServer.ts`) to simulate the optional upload token flow.

Key features:

- Project CRUD with IndexedDB persistence
- RoomPlan JSON import mapper and fixture
- Stitch assistant that computes transforms from shared openings
- Konva-based editor with grid, zoom, and wall metrics
- Export modules for SVG, PDF, DXF, and CSV schedules

## iOS Capture Helper

The `PlanKitCapture` folder contains SwiftUI sources for an iOS 17+ app leveraging RoomPlan. Build the app in Xcode, run on a LiDAR-capable device, scan a room, then export the generated JSON via Share Sheet or by uploading to the PWA when the optional backend is enabled.

## Development workflow

1. Capture a room on the iOS helper and export the JSON.
2. In the PWA, create a new project and import the JSON.
3. Use the Stitch tab to align rooms across shared openings.
4. Switch to Edit to fine tune geometry and review metrics.
5. Export deliverables (PDF/SVG/DXF/CSV) for downstream CAD/BIM tools.

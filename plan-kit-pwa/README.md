# PlanKit PWA

PlanKit is an offline-first floor plan editor that stitches together RoomPlan captures collected via the companion iOS helper. This project was bootstrapped with Vite + React + TypeScript and implements the core flows described in the product brief: project management, RoomPlan imports, stitching, editing, and exports (PDF, SVG, DXF, CSV).

## Getting started

```bash
npm install
npm run dev
```

The app registers a Workbox-powered service worker during production builds. Run `npm run build` followed by `npm run preview` to test the install prompt locally.

## Project structure

- `src/app` – Top-level routing and shell
- `src/features/import` – Room import UI and token flow
- `src/features/stitch` – Multi-room alignment assistant
- `src/features/editor` – Canvas-based plan editor built with Konva
- `src/features/export` – Export actions for PDF, SVG, DXF, CSV
- `src/lib` – Geometry helpers, import mappers, and exporter utilities
- `src/store` – IndexedDB persistence built with Dexie + Zustand

## Offline data

Projects are stored in IndexedDB via Dexie. The persisted Zustand slice keeps the last opened project in memory to enable instant reloads.

## Exports

The export modules produce simplified but functional outputs that exercise pdf-lib, dxf-writer, and native SVG generation. They act as foundations for richer title blocks and layer metadata.

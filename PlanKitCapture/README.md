# PlanKit Capture Helper

A lightweight SwiftUI application built on top of RoomPlan to capture a single room and export JSON compatible with the PlanKit PWA.

## Features

- Start/stop RoomPlan capture with live preview.
- Export JSON containing wall geometry, openings, and metadata.
- Share JSON through the iOS Share Sheet or upload to the PWA backend when available.

## Running

Open the Xcode project and run on an iOS device with a LiDAR sensor (iPhone Pro or iPad Pro). The project assumes the `RoomPlan` capability is enabled.

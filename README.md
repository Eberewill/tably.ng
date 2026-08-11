# Tably

Premium restaurant ordering and operations for dine-in and pickup.

## Workspace

- `apps/customer-web` — mobile-first menu and ordering PWA
- `apps/restaurant-web` — restaurant management and operations
- `apps/restaurant-desktop` — Tauri desktop companion for Windows/macOS
- `apps/api` — central Go API and PostgreSQL migrations
- `packages/*` — shared UI, contracts, domain logic, validation, and print layouts
- `native/*` — Rust crates for printing, offline sync, and device integration

## Design system

The Hospitality Editorial design system is the product UI contract across customer web, restaurant web, tablet, and desktop. Read the canonical [design system](docs/Tably-ng-Design-System-v2.1.md) before changing UI. Shared tokens and controls live in `packages/ui`; run `pnpm design:check` to enforce the core visual constraints.

## Start

```bash
pnpm install
pnpm dev
```

This starts customer web on port 3000, restaurant web on port 3001, and the native restaurant desktop app. Tauri starts its own Vite frontend on port 1420. Install the Rust toolchain and platform prerequisites before running the workspace development command.

Run the API in a second terminal with `pnpm dev:api`. All clients use this one authoritative backend; the desktop runtime only owns local hardware and offline capabilities. For focused development, use `pnpm dev:desktop` for the native app or `pnpm dev:desktop:web` for its browser-only preview.

## Product boundaries

The browser remains the management surface. Desktop adds printing, local resilience, auto-start, notifications, and device access. QR payloads are issued and signed by the server; clients only render them.

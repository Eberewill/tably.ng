# Tably

Premium restaurant ordering and operations for dine-in and pickup.

## Workspace

- `apps/customer-web` — mobile-first menu and ordering PWA
- `apps/restaurant-app` — canonical restaurant management app for web, desktop, and tablets
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

This starts customer web on port 3000 and the native restaurant app. Tauri starts the restaurant app's Vite frontend on port 1420. Install the Rust toolchain and platform prerequisites before running the workspace development command.

Run the API in a second terminal with `pnpm dev:api`. All clients use this one authoritative backend; the native runtime only owns platform capabilities such as hardware, notifications, and offline resilience. For focused development, use `pnpm dev:app` for the native app or `pnpm dev:app:web` for its browser/static preview.

## Product boundaries

`apps/restaurant-app` is the single restaurant-owner interface. Its Vite build is deployable to the web and is also packaged by Tauri for macOS, Windows, Linux, iOS, and Android. Platform-specific capabilities stay behind runtime adapters; product screens, auth, navigation, and data flows remain shared. QR payloads are issued and signed by the server; clients only render them.

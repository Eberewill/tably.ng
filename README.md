# Tably

Premium restaurant ordering and operations for dine-in and pickup.

## Workspace

- `apps/customer-web` — mobile-first menu and ordering PWA
- `apps/restaurant-web` — restaurant management and operations
- `apps/restaurant-desktop` — Tauri desktop companion for Windows/macOS
- `packages/*` — shared UI, contracts, domain logic, validation, and print layouts
- `native/*` — Rust crates for printing, offline sync, and device integration

## Start

```bash
corepack pnpm install
corepack pnpm dev
```

Customer web runs on port 3000 and restaurant web on port 3001. Install the Rust toolchain and platform prerequisites before running `pnpm --filter @tably/restaurant-desktop tauri dev`.

## Product boundaries

The browser remains the management surface. Desktop adds printing, local resilience, auto-start, notifications, and device access. QR payloads are issued and signed by the server; clients only render them.

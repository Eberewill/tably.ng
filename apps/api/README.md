# Tably API

The central, authoritative Go API for every Tably client. It starts as a modular monolith: package boundaries are explicit, while deployment and operations remain simple.

## Run

```bash
cp .env.example .env
set -a; . ./.env; set +a
go run ./cmd/api
```

Endpoints:

- `GET /health/live` — process liveness
- `GET /health/ready` — dependency readiness (database checks will be added with persistence)
- `GET /api/v1` — API identity/version

The web and desktop clients use this same service. Desktop-native code remains responsible only for local printers, devices, caching, and offline synchronization.

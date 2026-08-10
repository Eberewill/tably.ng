# Design-system instructions

The canonical product design reference is [`../docs/Tably-ng-Design-System-v2.1.md`](../docs/Tably-ng-Design-System-v2.1.md). Treat it as a release requirement for customer web, restaurant web, and restaurant desktop.

Use `@tably/ui/tokens.css` for color, shape, type, and motion. Keep enforcement in `scripts/check-design-system.mjs` current when the system changes, and run `pnpm design:check` after UI changes.

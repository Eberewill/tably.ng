# Tably.ng contributor guide

Read [`docs/Tably-ng-Design-System-v2.1.md`](docs/Tably-ng-Design-System-v2.1.md) before changing a user interface.

All browser and desktop UI must import `@tably/ui/tokens.css`; do not recreate tokens in an app. The shared tokens and base controls in `packages/ui` are the implementation of the Hospitality Editorial system.

Before submitting UI work, run `pnpm design:check`, `pnpm typecheck`, and the relevant build. The design check protects the deliberate constraints: no gradients or glass effects, no pill-shaped primary controls, no conventional card shadows, restrained radii and weights, and shared-token adoption on each surface.

Use whitespace, typography, alignment, tonal shifts, and a single hairline divider before adding a container. Avoid dashboard-card layouts and decorative UI. Desktop may be denser, but it follows the same tokens and visual character as web.

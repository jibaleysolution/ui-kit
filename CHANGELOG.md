# Changelog

## 0.3.0

### Added

- **`DateField`** — native styled date / datetime-local / time / month input with an ISO-string v-model (maps straight to Laravel/DB); forced `dir="ltr"` so dates read correctly in RTL. Prefer it over `<Input type="date">`.
- **`DateRangeField`** — from→to date range (two cross-bound `DateField`s) for report and filter pages; `{ start, end }` v-model.

## 0.2.2

- Added LICENSE (MIT), CONTRIBUTING.md, SECURITY.md, and package metadata (author, repository, homepage, bugs, keywords).

## 0.2.1

- Published via the GitHub Actions release workflow.

## 0.2.0

### Added

- **Runtime brand theming** — `useBrandColor(hex)` injects a full `--color-brand-50…900` ramp derived from one color onto `:root` for per-tenant white-labeling (live, no rebuild). `brandRamp(hex)` exposes the pure ramp values. Static override via a consumer `@theme` block is documented too.
- **9 new components** (reka-ui backed): `DropdownMenu` (overflow/action menu), `Tabs`, `Sheet` (RTL-aware edge drawer), `Avatar`, `Alert` (inline banner), `Spinner`, `Checkbox`, `RadioGroup`, `Tooltip`.
- **4 charts** (dependency-free SVG, follow the brand color): `BarChart`, `HBarChart`, `DonutChart`, `TrendChart`.
- **Playground** (`npm run play`) — a Vite gallery of every component with a live brand-color switcher and RTL toggle.
- **Tests + CI** — Vitest smoke suite (`npm run test`) and a GitHub Actions workflow (typecheck + test + build).

### Changed

- `theme.css` gains directional slide keyframes for `Sheet`; header comment corrected to `@jibaleysolution/ui`.
- AGENTS.md/CLAUDE.md, the `jibaley-ui` skill, and `llms.txt` document the new components, composables, charts, and re-branding.

## 0.1.1

- Republished under the `@jibaleysolution` npm scope.

## 0.1.0

- Initial release: 31 components, 5 composables, design tokens, and the AI-discovery layer (AGENTS.md/CLAUDE.md catalog, `jibaley-ui` skill, `init` CLI, `llms.txt`). Extracted from jakil's design system; jakil migrated to consume it.

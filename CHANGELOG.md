# Changelog

## 0.5.0

### Added

- **`TranslatableField` can follow one language switch for the whole page.** New optional `activeLocale` prop (`v-model:active-locale`): when set, the field renders only that locale's control — no tab bar, no grid — so a single `SegmentedControl` changes the language of every field at once, instead of one click per field. The label's required asterisk then shows only while the shown locale is the required one.
- **`referenceLocale`** — while another locale is shown, the reference text (e.g. the French) sits above the control as read-only text to translate from, with the locale code in front.
- **`missingLabel`** — an amber `StatusBadge` beside the label while the shown translation is empty. The kit ships no copy for it: no label, no badge.
- **Errors stay visible without tabs.** After a failed submit the field emits `update:activeLocale` with its first locale in error (never away from a locale that itself shows one, the rule the tabs already follow), and any error left on a locale that is not on screen is named in red under the control — which also covers a parent that binds `:active-locale` one-way, and two fields failing in different languages under one switch.
- Playground: a "one language switch for the page" example, with a simulated failed save.

### Unchanged

- Without `activeLocale`, `layout="tabs"` and `layout="grid"` render and behave exactly as in 0.4.x. The JSON contract is the same in every mode: each write re-emits every configured locale as a string and preserves locales that are not configured.

## 0.4.1

### Fixed

- **`BarChart` rendered no bars at all.** `items-end` on the chart row let each column collapse to its label's height, so the flex-1 bar area was 0px tall and every percentage bar height computed to 0. Columns now stretch to the row's fixed height, so bars render at heights proportional to their values (and `accentPeak` still reddens the tallest).
- **`BarChart` labels overflowed the card on narrow screens.** `whitespace-nowrap` labels set each column's min-content width, so 14 date labels pushed ~130px past a 375px-wide card. Columns now take `min-w-0`, and past `maxTicks` labels (new prop, default 7) ticks are thinned to every Nth, anchored on the last (newest) label — matching `TrendChart`. The `-rotate-45` mobile label hack is gone; rotation never reflowed the layout anyway.



### Added

- **`TranslatableField`** — one field for a multi-locale JSON column (`{"fr":"…","ar":"…"}`). Locale switching as **tabs** (or side-by-side `grid`), dotted error resolution (`errors['name.fr']`, including nested `option_groups.0.name.fr`), a **red dot on any tab whose locale has an error** (essential — reka-ui unmounts hidden panels, so those errors are otherwise invisible), required-locale marking, and a guaranteed submission shape: every configured locale key is always present as a string, unknown stored locales are preserved, and nothing is ever `JSON.stringify`d.
- `dirForLocale(code)` — RTL detection by primary subtag (`ar-MA` → rtl), exported from `lib`.
- `Tabs` gains a `#tab-label` scoped slot (`{ tab, active }`) so labels can carry badges/dots. Fully backwards-compatible — the fallback renders `tab.label` exactly as before.
- `Input` and `Textarea` gain a styled `disabled` prop.

### Note

`requiredLocale` defaults to the Inertia `locale` page prop, which is the **viewer's UI language**. If your backend always requires one fixed locale, pass `required-locale="fr"` explicitly.

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

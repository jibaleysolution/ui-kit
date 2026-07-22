# @jibaleysolution/ui — theme reference

Import once, after Tailwind, in your CSS entry:

```css
@import 'tailwindcss';
@import '@jibaleysolution/ui/theme.css';
```

## Tokens (`@theme`)

| Token | Value | Use |
|---|---|---|
| `--color-brand-50…900` | `#fff4ee` … `#78250b` (500 = `#fc4401`) | Actions, active state, gradient heroes. **Reserved** — don't use brand color for decoration. |
| `--color-canvas` | `#f6f7f9` | Page background. |
| `--color-card` | `#ffffff` | Card/surface background. |
| `--color-ink` | `#101828` | Primary text. |
| `--color-muted` | `#667085` | Secondary text. |
| `--color-border` | `#e7eaee` | Hairline borders. |
| `--color-sidebar` | `#0d1117` | Near-black sidebar chrome. |
| `--color-airtel` / `--color-moov` / `--color-epn` | operator accent colors | Deliberately **not** brand — used only for operator-specific badges/icons, never for primary actions. |
| `--radius-md` | `0.625rem` (10px) | Controls (inputs, buttons). |
| `--radius-2xl` | `1rem` (16px) | Cards (`.card`). |
| `--radius-3xl` | `1.5rem` (24px) | CTA/hero bands. |
| `--shadow-card` | resting elevation | Default card shadow. |
| `--shadow-card-lg` | hover/overlay elevation | `.card-lift:hover`, dialogs/modals. **These are the only two shadow levels** — don't introduce `shadow-sm`/`shadow-xl`. |
| `--font-sans` | Manrope Variable → Cairo Variable → system stack | Body font; `ss01`/`cv11` feature settings baked in. |
| `--font-arabic` | Cairo Variable → system stack | Swapped in automatically when `html[dir="rtl"]`. |

## `Tone` (StatusBadge / toneFor)

```ts
type Tone = 'green' | 'red' | 'amber' | 'sky' | 'teal' | 'neutral';
```

| Tone | Typical meaning |
|---|---|
| `green` | active / paid / completed / accepted |
| `amber` | pending / partial / warning |
| `red` | rejected / unpaid / danger / revoked |
| `sky` | in transit / approved / informational |
| `teal` | secondary positive state |
| `neutral` | unknown / suspended / cancelled / default fallback |

Keep the actual `status string → Tone` mapping in your app (e.g. `resources/js/lib/badges.ts`) and pass it through `toneFor(map, status)`. Don't hardcode tone-to-color logic outside `StatusBadge`.

## Light mode only

There is no dark theme. Don't add `dark:` Tailwind variants to any component or consuming page — they will be inert at best and inconsistent at worst.

## RTL rules

The system is RTL-first (Arabic via Cairo). Rules for any new markup:

- Use **logical** Tailwind utilities, never physical ones:
  - `ps-*` / `pe-*` instead of `pl-*` / `pr-*`
  - `ms-*` / `me-*` instead of `ml-*` / `mr-*`
  - `start-*` / `end-*` instead of `left-*` / `right-*`
  - `text-start` / `text-end` instead of `text-left` / `text-right`
- Directional icons (back arrows, chevrons meaning "previous") need an `rtl:rotate-180` (see `PageHeader`'s back arrow, `RowActions`).
- Toggle/switch knobs need an explicit `rtl:-translate-x-*` counterpart (see `Toggle`).
- Set `dir` on `<html>` from the current locale; `html[dir='rtl'] body` in the shipped theme automatically swaps to the Arabic font stack.
- `prefers-reduced-motion: reduce` is already handled globally in `theme.css` — don't re-implement it per component.

## Focus

A global 2px brand-colored focus outline is applied to interactive elements (`a`, `button`, `input`, `select`, `textarea`, `[role="button"]`, `[tabindex]`) via `:focus-visible` in `theme.css`. Don't override it with `focus:outline-none` unless you're replacing it with an equivalent visible focus style.

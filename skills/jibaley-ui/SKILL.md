---
name: jibaley-ui
description: "Always invoke when building or editing admin-panel UI in a project that depends on @jibaleysolution/ui: tables/DataTable, cards, badges/status pills, forms (inputs, selects, toggles, textareas, file uploads, tags), modals/dialogs/confirm dialogs, pagination, toasts, page headers, empty states, row actions, search/filter bars, key-value or repeater editors, or any CRUD index/create/edit page. The @jibaleysolution/ui npm package already provides Vue 3 components for all of this — you MUST import them and MUST NOT rewrite, copy, or fork them locally. Skip for backend PHP/API-only endpoints and any JS/TS file with no Vue template."
license: MIT
metadata:
  author: jibaley
---

## When to Apply

- Any `.vue` file under an admin/dashboard/panel area of a project that has `@jibaleysolution/ui` in `package.json`.
- Building a new CRUD page (index/create/edit/show) for any resource.
- Adding a table, list, badge, form field, modal, dialog, confirm prompt, pagination, toast, or empty state.
- Refactoring existing admin UI that currently hand-rolls one of the above.

**Before writing any UI markup, read `references/components.md`** for the full prop/slot/emit catalog — do not guess an API from memory.

## Import cheatsheet

```ts
import {
    Button, Card, Badge /* -> use StatusBadge */, StatusBadge, DataTable, SortableHeader,
    RowActions, DropdownMenu, ConfirmDialog, Modal, Sheet, Pagination, EmptyState, FilterBar, SearchInput,
    FormShell, Label, Input, Textarea, Select, Toggle, Checkbox, RadioGroup, DateField, DateRangeField,
    TranslatableField, FieldError,
    PageHeader, StatCard, Tabs, Tooltip, Avatar, Alert, Spinner,
    KeyValue, Repeater, TagsInput, FileUpload, ColorField, CodeChip, DescriptionList,
    SegmentedControl, Skeleton, Toaster,
    BarChart, HBarChart, DonutChart, TrendChart,
    useToast, useTrans, useDataTable, useClipboard, useDebounceFn, useBrandColor,
    toneFor,
} from '@jibaleysolution/ui';
import type { Tone, Paginated, PaginatedMeta, FlashToast, ToastType, MenuItem } from '@jibaleysolution/ui';
```

There is no exported component literally named `Badge` — status pills are `StatusBadge`. For row actions: ≤3 → `RowActions` (inline icons); >3 → `DropdownMenu` (overflow menu). To re-brand, override `--color-brand-*` or call `useBrandColor(hex)` — see `references/theme.md`.

## Recipes (short form — full versions in `references/recipes.md`)

- **Index page**: `FilterBar` + `SearchInput` (+ `useDataTable` for search/sort/reload) → `DataTable` (`#head`/`#body`/`#footer`) with `SortableHeader` in headers, `StatusBadge` + `toneFor(map, status)` for status cells, `RowActions` in the trailing cell → `ConfirmDialog` for delete → `EmptyState` when empty, `Pagination` in `#footer`.
- **Form page**: `FormShell` (layout) → `Card` → `Label` + `Input`/`Select`/`Textarea`/`Toggle`/`FileUpload`/`TagsInput`/`KeyValue` bound to Inertia `useForm()`, each paired with `FieldError :message="form.errors.x"` and `:invalid="!!form.errors.x"` on the field.
- **Modal vs. ConfirmDialog**: destructive/yes-no → `ConfirmDialog`. Anything richer (a form, details) → `Modal` with its `#footer` slot. Neither fits → the re-exported raw reka-ui `Dialog*` primitives.
- **Toasts**: mount `<Toaster />` once in the root layout; server flashes `{ type, message }` under the `toast` flash key.
- **Multi-language JSON column** (`{"fr":"…","ar":"…"}`): one `TranslatableField` with `name` as the **dotted path prefix** and `:errors="form.errors"` (the whole bag). Inside a `Repeater`, interpolate the runtime index: `` :name="`option_groups.${gi}.name`" ``.
- **Many translatable fields on one page**: one `SegmentedControl` for the page, every `TranslatableField` bound to it with `v-model:active-locale="lang"`, plus `reference-locale="fr"` (source text above the box) and `missing-label` (amber badge while a translation is empty). No per-field tabs.

## Common Pitfalls

- Recreating `Button`, `StatusBadge`, `Card`, or any field component locally "just for this page" — extend the kit instead (see `AGENTS.md` at the consumer project root, or the ui-kit repo itself).
- Hardcoding hex colors or ad-hoc shadows instead of the theme tokens (`bg-brand-500`, `.card`, `shadow-card`/`shadow-card-lg`).
- Using physical Tailwind utilities (`pl-`, `pr-`, `left-`, `right-`) instead of logical ones (`ps-`, `pe-`, `start-`, `end-`) — this breaks RTL locales.
- Reaching for a bespoke `<Teleport>`/modal implementation when `Modal` or `ConfirmDialog` already covers the case.
- Calling `alert()`/`confirm()` instead of `useToast()` / `ConfirmDialog`.
- Adding `dark:` variants — this design system is light-mode only.
- Building a per-row dropdown menu for row actions — the established pattern is inline icon buttons via `RowActions`, not a `DropdownMenu`.
- Hand-rolling a translatable field as two `Input`s bound to `form.name.fr` / `form.name.ar` — use `TranslatableField`, which also keeps every locale key present in the submitted JSON.
- Giving every translatable field on a long page its own tabs, or building a page-level language switch out of local components — bind the fields to one switch with `v-model:active-locale`.
- Calling `JSON.stringify` on a translations object, or adding `transform()` to "fix" it — Inertia already sends a nested object, and multipart serializes it to `name[fr]` which PHP re-parses into an array. Stringifying breaks the `name.fr` validation rules.
- Putting domain status→tone maps (e.g. `orderStatusTone`) inside the kit — those stay in the consuming app; only `toneFor()` and the `Tone` type live in `@jibaleysolution/ui`.

See `references/theme.md` for the full token list and RTL rules, and `references/recipes.md` for complete, runnable page examples.

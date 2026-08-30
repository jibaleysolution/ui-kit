# @jibaleysolution/ui — full component reference

Import style: `import { Button, DataTable, useToast } from '@jibaleysolution/ui';`

## Components

| Component | Props (name: type = default) | Slots | Emits | Notes |
|---|---|---|---|---|
| **Button** | `variant?: 'primary'\|'secondary'\|'outline'\|'ghost'\|'danger' = 'secondary'`, `size?: 'sm'\|'md' = 'md'`, `type? = 'button'`, `loading? = false`, `disabled? = false` | default | — | Only `primary` is filled brand-orange; `loading` shows a spinner and disables the button. |
| **Card** | `lift? = false`, `padded? = true` | default | — | Thin wrapper over the `.card` CSS class. `lift` adds hover elevation (`.card-lift`). |
| **CodeChip** | `value: string`, `tone?: 'default'\|'inverse' = 'default'`, `copyable? = true` | — | — | Monospace pill with a copy-to-clipboard button (via `useClipboard`). |
| **ColorField** | `id?: string`, `modelValue: string = '#fc4401'` (v-model) | — | — | Native color swatch + synced hex text input. |
| **ConfirmDialog** | `title: string`, `body?: string`, `confirmLabel?: string`, `tone?: 'primary'\|'danger' = 'primary'`, `loading? = false`, `open: boolean` (v-model) | — | `confirm` | The **only** dialog with built-in Cancel/Confirm buttons (labels via `useTrans`). Use for delete/destructive confirmations. |
| **DataTable** | — | `#head`, `#body`, `#footer` | — | Card-wrapped, horizontally-scrolling `<table>` shell. You supply raw `<th>`/`<tr>`/`<td>` markup — this is a shell, not a data grid. |
| **DateField** | `id?`, `type?: 'date'\|'datetime-local'\|'time'\|'month' = 'date'`, `min?`, `max?`, `required?`, `invalid?`, `modelValue: string` (v-model) | — | — | Native styled date/time input; ISO-string v-model, `dir="ltr"`. Prefer over `<Input type="date">`. |
| **DateRangeField** | `type? = 'date'`, `required?`, `invalid?`, `modelValue: { start; end }` (v-model) | — | — | From→to date range (two cross-bound `DateField`s) for reports/filters. |
| **DescriptionList** | `rows: { label: string; value: string \| number \| null }[]` | dynamic, named per `row.label` | — | Key/value grid (`<dl>`); override a row's rendering via a slot named after its label. |
| **EmptyState** | `title: string`, `description?: string` | default (e.g. an action button) | — | Inbox icon + message. Render inside a `DataTable`'s `#footer` when the list is empty. |
| **FieldError** | `message?: string` | — | — | Renders nothing when `message` is falsy. Feed directly from `form.errors.<field>`. |
| **FileUpload** | `id?: string`, `currentUrl?: string \| null`, `accept? = 'image/*'`, `hint?: string`, `modelValue: File \| null` (v-model) | default (button label override) | — | Avatar-style drag/click upload with local object-URL preview + clear button. |
| **FilterBar** | — | default | — | Card row wrapper for filter controls (search input, selects) on index/report pages. |
| **FormShell** | `title: string`, `description?: string`, `backHref?: string`, `backLabel?: string` | `#aside`, default | — | Two-column responsive form layout (sticky title/description aside + form). Layout only — no validation logic. |
| **Input** | `id?`, `type? = 'text'`, `placeholder?`, `autocomplete?`, `required?`, `dir?: 'ltr'\|'rtl'`, `invalid?: boolean`, `modelValue: string \| number` (v-model) | — | — | `invalid` swaps the border red and sets `aria-invalid`. Pair with `Label` + `FieldError`. |
| **KeyValue** | `keyLabel?`, `valueLabel?`, `addLabel? = 'Add'`, `modelValue: Record<string,string> = {}` (v-model) | — | — | Add/remove repeater of key/value text rows, backed by a plain object. |
| **Label** | `for?: string` | default | — | Plain `<label>`. |
| **Modal** | `title?: string`, `description?: string`, `size?: 'sm'\|'md'\|'lg'\|'xl' = 'md'`, `open: boolean` (v-model) | default, `#footer` | — | Generic dialog for anything richer than a confirm — bring your own footer buttons. Has a built-in close (X). |
| **PageHeader** | `title: string`, `subtitle?: string` | `#badge`, `#actions` | — | Page-level heading row (title + optional badge + right-aligned actions). |
| **Pagination** | `meta: PaginatedMeta` | — | — | Renders a Laravel paginator's `links[]` as Inertia `<Link preserve-scroll preserve-state>` + a localized "Showing X–Y of Z" line. Hides itself when `meta.total === 0`. |
| **Repeater** | `newItem: () => T`, `addLabel?`, `itemLabel?: (item: T, index: number) => string`, `collapsible? = false`, `emptyLabel?`, `modelValue: T[] = []` (v-model) | `#item="{ item, index }"` | — | Generic sortable/collapsible list editor (move up/down, add, remove). |
| **RowActions** | `viewHref?: string`, `editHref?: string`, `deletable? = false` | default (extra actions) | `delete` | Inline view/edit/delete icon buttons for a table row. Delete only emits — the page owns the confirm dialog. Not a dropdown menu. |
| **SearchInput** | `placeholder?`, `delay? = 300`, `modelValue: string` (v-model) | — | `search: [value: string]` | Debounced search box with a leading icon. |
| **SegmentedControl** | `segments: { value: string; label: string }[]`, `modelValue: string` (v-model) | — | — | Pill-style single-select toggle group. |
| **Select** | `id?`, `options: { value: string; label: string }[]`, `modelValue: string` (v-model) | — | — | Native `<select>` styled to match `Input`, with a chevron icon. |
| **Skeleton** | `class?: string` | — | — | Pulsing placeholder block. |
| **SortableHeader** | `label: string`, `column: string`, `active: string`, `dir: 'asc'\|'desc'` | — | `sort: [column: string]` | Table header button; shows an up/down/neutral chevron depending on `active`/`dir`. Pair with `useDataTable`. |
| **StatCard** | `label: string`, `value: string \| number`, `description?: string`, `icon?: Component` | — | — | KPI card (label, big number, optional icon chip). |
| **StatusBadge** | `label: string`, `tone?: Tone = 'neutral'`, `dot? = true` | — | — | Soft-tint status pill. `Tone = 'green'\|'red'\|'amber'\|'sky'\|'teal'\|'neutral'`. |
| **TagsInput** | `id?`, `suggestions?: string[]`, `placeholder?`, `modelValue: string[] = []` (v-model) | — | — | Chip input: Enter/comma adds, Backspace on empty draft pops the last tag, optional suggestion pills. |
| **Textarea** | `id?`, `placeholder?`, `rows? = 4`, `required?`, `dir?: 'ltr'\|'rtl'`, `invalid?`, `modelValue: string \| number` (v-model) | — | — | Mirrors `Input`'s API and invalid-state styling. |
| **Toaster** | — | — | — | Mount once per app. Calls `useToast().wireFlash()` internally. |
| **Toggle** | `id?`, `modelValue: boolean = false` (v-model) | — | — | Switch (`role="switch"`), RTL-aware knob direction. |
| **Alert** | `tone?: 'info'\|'success'\|'warning'\|'danger' = 'info'`, `title?`, `dismissible? = false` | default | — | Inline persistent banner (distinct from transient `Toaster`). |
| **Avatar** | `src?: string \| null`, `name?`, `size?: 'sm'\|'md'\|'lg' = 'md'` | — | — | Image with initials fallback from `name`. |
| **Checkbox** | `id?`, `disabled?`, `modelValue: boolean = false` (v-model) | default (label) | — | Single checkbox + label. Multi-select lists; use `Toggle` for on/off settings. |
| **DropdownMenu** | `items: MenuItem[]`, `align?: 'start'\|'end' = 'end'` | `#trigger` | `select` | Overflow/action menu. `MenuItem = { label; icon?; href?; danger?; separatorBefore? }`. Use for **>3** actions; `RowActions` for ≤3. |
| **RadioGroup** | `options: { value; label }[]`, `disabled?`, `modelValue: string` (v-model) | — | — | Vertical radio list. |
| **Sheet** | `title?`, `description?`, `side?: 'start'\|'end'\|'top'\|'bottom' = 'end'`, `open: boolean` (v-model) | default, `#footer` | — | Edge drawer (RTL-aware `start`/`end`); same slots as `Modal`. |
| **Spinner** | `size?: 'sm'\|'md'\|'lg' = 'md'` | — | — | Standalone brand spinner. |
| **Tabs** | `tabs: { value; label }[]`, `modelValue: string` (v-model) | one slot per `tab.value` | — | Underline tab bar; panel per named slot. |
| **Tooltip** | `content?`, `side?: 'top'\|'right'\|'bottom'\|'left' = 'top'`, `delay? = 200` | default (trigger), `#content` | — | Hover/focus tooltip. |
| **TranslatableField** | `name: string` (dotted path prefix), `errors?` (the whole `form.errors`), `locales? = ['fr','ar']`, `label?`, `required?`, `requiredLocale?`, `layout?: 'tabs'\|'grid' = 'tabs'`, `multiline?`, `rows?`, `placeholder?`, `hint?`, `disabled?`, `id?`, `modelValue: Record<string,string>` (v-model) | — | — | Multi-locale **JSON column** field: locale tabs (or `grid`), red dot on any tab whose locale has an error, always emits every locale key. Use instead of paired `Input`s. Pass `required-locale` explicitly when the backend pins one locale. |
| **BarChart** | `labels: string[]`, `data: number[]`, `color? = brand`, `accentPeak? = false`, `maxTicks? = 7` | — | — | Vertical bars; past `maxTicks` labels, ticks thin to every Nth (last label kept). |
| **HBarChart** | `labels: string[]`, `data: number[]`, `format?` | — | — | Horizontal ranked bars. |
| **DonutChart** | `labels: string[]`, `data: number[]`, `donut? = true`, `format?` | — | — | Donut/pie + legend. |
| **TrendChart** | `series: { label; value }[]`, `title?` | — | — | Line + area trend. |

## Composables

| Export | Signature | Notes |
|---|---|---|
| `useToast()` | `{ toasts, push(message, type = 'success'), dismiss(id), wireFlash() }` | `wireFlash()` watches Inertia `page.props.flash.toast`; already called inside `Toaster`. |
| `useTrans()` | `{ t(key, params?) }` | Reads `page.props.translations`; falls back to a built-in English map, then the raw key. |
| `useClipboard(resetAfter = 1500)` | `{ copied, copy(text) }` | Used internally by `CodeChip`. |
| `useDebounceFn(fn, delay = 300)` | debounced `fn` | Used internally by `SearchInput`. |
| `useDataTable(initialFilters?)` | `{ filters, onSearch(value), sortBy(column), reload() }` | Server-driven search/sort — reloads current pathname via Inertia `router.get`, no Ziggy needed. |
| `useBrandColor(hex, target?)` | applies a runtime brand ramp | Injects `--color-brand-50…900` derived from `hex` onto `:root`/`target`. Per-tenant white-label; no-op on empty/SSR. |
| `brandRamp(hex)` | `Record<'--color-brand-*', string>` | Pure ramp values (CSS `color-mix()` strings) for SSR/inline styles. |

## `lib` exports

- `toneFor(map, key, fallback = 'neutral')` — resolve a domain status string against your own status→tone map (kept in your app, not the kit).
- Types: `Tone`, `Paginated<T>`, `PaginatedMeta`, `PaginationLink`, `FlashToast`, `ToastType`.

## Escape hatch

Re-exported raw reka-ui Dialog primitives: `DialogRoot`, `DialogTrigger`, `DialogPortal`, `DialogOverlay`, `DialogContent`, `DialogTitle`, `DialogDescription`, `DialogClose`.

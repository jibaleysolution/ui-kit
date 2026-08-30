# @jibaleysolution/ui

Jibaley ecosystem design system — a Vue 3 + Inertia + reka-ui + Tailwind 4 component kit shared across admin panels (jakil, jibaley-api, kitchen).

## HARD RULE

**Every component listed below MUST be imported from `@jibaleysolution/ui`. Never recreate, copy, or fork a local version of Button, Card, Badge, Table, Modal, Form fields, etc.** If a component is missing a feature you need, extend it in the `@jibaleysolution/ui` repo (`/Users/ikay/sites/ui-kit`) and bump the version — do not patch around it with a local component. Before writing any new UI, check the catalog below first.

## Setup (consumer project)

1. `npm install -D @jibaleysolution/ui`
2. In your CSS entry, import the theme **after** Tailwind:
   ```css
   @import 'tailwindcss';
   @import '@jibaleysolution/ui/theme.css';
   ```
3. Run `npx @jibaleysolution/ui init` once to install the AI skill into `.claude/skills/`, `.agents/skills/`, `.github/skills/` and print a CLAUDE.md/AGENTS.md snippet to paste into your project.

Peer requirements: `vue ^3.5`, `@inertiajs/vue3 ^2.0`, `reka-ui ^2.10`, `@lucide/vue ^1.25`, Tailwind CSS `>=4.0`. Bring your own fonts (the theme references `Manrope Variable` / `Cairo Variable` by family name; the jakil/jibaley-api projects already install `@fontsource-variable/manrope` + `@fontsource-variable/cairo`).

## Component catalog

Import style: `import { Button, DataTable, useToast } from '@jibaleysolution/ui';`

| Component | Props (name: type = default) | Slots | Emits | Notes |
|---|---|---|---|---|
| **Button** | `variant?: 'primary'\|'secondary'\|'outline'\|'ghost'\|'danger' = 'secondary'`, `size?: 'sm'\|'md' = 'md'`, `type? = 'button'`, `loading? = false`, `disabled? = false` | default | — | Only `primary` is filled brand-orange; `loading` shows a spinner and disables the button. |
| **Card** | `lift? = false`, `padded? = true` | default | — | Thin wrapper over the `.card` CSS class. `lift` adds hover elevation (`.card-lift`). |
| **CodeChip** | `value: string`, `tone?: 'default'\|'inverse' = 'default'`, `copyable? = true` | — | — | Monospace pill with a copy-to-clipboard button (via `useClipboard`). |
| **ColorField** | `id?: string`, `modelValue: string = '#fc4401'` (v-model) | — | — | Native color swatch + synced hex text input. |
| **ConfirmDialog** | `title: string`, `body?: string`, `confirmLabel?: string`, `tone?: 'primary'\|'danger' = 'primary'`, `loading? = false`, `open: boolean` (v-model) | — | `confirm` | The **only** dialog with built-in Cancel/Confirm buttons (labels via `useTrans`). Use for delete/destructive confirmations. |
| **DataTable** | — | `#head`, `#body`, `#footer` | — | Card-wrapped, horizontally-scrolling `<table>` shell. You supply raw `<th>`/`<tr>`/`<td>` markup — this is a shell, not a data grid. |
| **DateField** | `id?`, `type?: 'date'\|'datetime-local'\|'time'\|'month' = 'date'`, `min?`, `max?`, `required?`, `invalid?`, `modelValue: string` (v-model) | — | — | Native styled date/time input; v-model is an ISO string (`YYYY-MM-DD`…) that maps straight to Laravel/DB. Forced `dir="ltr"` so dates read correctly in RTL. |
| **DateRangeField** | `type? = 'date'`, `required?`, `invalid?`, `modelValue: { start: string; end: string }` (v-model) | — | — | Two `DateField`s (from → to) with cross-bound min/max. For report/filter date ranges. |
| **DescriptionList** | `rows: { label: string; value: string \| number \| null }[]` | dynamic, named per `row.label` | — | Key/value grid (`<dl>`); override a row's rendering via a slot named after its label. |
| **EmptyState** | `title: string`, `description?: string` | default (e.g. an action button) | — | Inbox icon + message. Render inside a `DataTable`'s `#footer` when the list is empty. |
| **FieldError** | `message?: string` | — | — | Renders nothing when `message` is falsy. Feed directly from `form.errors.<field>`. |
| **FileUpload** | `id?: string`, `currentUrl?: string \| null`, `accept? = 'image/*'`, `hint?: string`, `modelValue: File \| null` (v-model) | default (button label override) | — | Avatar-style drag/click upload with local object-URL preview + clear button. |
| **FormShell** | `title: string`, `description?: string`, `backHref?: string`, `backLabel?: string` | `#aside`, default | — | Two-column responsive form layout (sticky title/description aside + form). Layout only — no validation logic. |
| **Input** | `id?`, `type? = 'text'`, `placeholder?`, `autocomplete?`, `required?`, `disabled?`, `dir?: 'ltr'\|'rtl'`, `invalid?: boolean`, `modelValue: string \| number` (v-model) | — | — | `invalid` swaps the border red and sets `aria-invalid`. Pair with `Label` + `FieldError`. |
| **KeyValue** | `keyLabel?`, `valueLabel?`, `addLabel? = 'Add'`, `modelValue: Record<string,string> = {}` (v-model) | — | — | Add/remove repeater of key/value text rows, backed by a plain object. |
| **Label** | `for?: string` | default | — | Plain `<label>`. |
| **Modal** | `title?: string`, `description?: string`, `size?: 'sm'\|'md'\|'lg'\|'xl' = 'md'`, `open: boolean` (v-model) | default, `#footer` | — | **Generic** dialog — use for anything that isn't a simple confirm (multi-field forms in a modal, detail views). Has its own close (X). For destructive confirmations, prefer `ConfirmDialog`. |
| **PageHeader** | `title: string`, `subtitle?: string` | `#badge`, `#actions` | — | Page-level heading row (title + optional badge + right-aligned actions). |
| **Pagination** | `meta: PaginatedMeta` | — | — | Renders a Laravel paginator's `links[]` as Inertia `<Link preserve-scroll preserve-state>` + a localized "Showing X–Y of Z" line. Hides itself when `meta.total === 0`. |
| **Repeater** | `newItem: () => T`, `addLabel?`, `itemLabel?: (item: T, index: number) => string`, `collapsible? = false`, `emptyLabel?`, `modelValue: T[] = []` (v-model) | `#item="{ item, index }"` | — | Generic sortable/collapsible list editor (move up/down, add, remove). |
| **RowActions** | `viewHref?: string`, `editHref?: string`, `deletable? = false` | default (extra actions) | `delete` | Inline view/edit/delete icon buttons for a table row. Delete only emits — the page owns the confirm dialog (pair with `ConfirmDialog`). **Not** a dropdown menu. |
| **SearchInput** | `placeholder?`, `delay? = 300`, `modelValue: string` (v-model) | — | `search: [value: string]` | Debounced search box with a leading icon. |
| **SegmentedControl** | `segments: { value: string; label: string }[]`, `modelValue: string` (v-model) | — | — | Pill-style single-select toggle group. |
| **Select** | `id?`, `options: { value: string; label: string }[]`, `modelValue: string` (v-model) | — | — | Native `<select>` styled to match `Input`, with a chevron icon. |
| **Skeleton** | `class?: string` | — | — | Pulsing placeholder block. |
| **SortableHeader** | `label: string`, `column: string`, `active: string`, `dir: 'asc'\|'desc'` | — | `sort: [column: string]` | Table header button; shows an up/down/neutral chevron depending on `active`/`dir`. Pair with `useDataTable`. |
| **StatCard** | `label: string`, `value: string \| number`, `description?: string`, `icon?: Component` | — | — | KPI card (label, big number, optional icon chip). |
| **StatusBadge** | `label: string`, `tone?: Tone = 'neutral'`, `dot? = true` | — | — | Soft-tint status pill. `Tone = 'green'\|'red'\|'amber'\|'sky'\|'teal'\|'neutral'`. Map your domain status strings to a `Tone` with `toneFor()` — keep the status→tone map in your own app, not in the kit. |
| **TagsInput** | `id?`, `suggestions?: string[]`, `placeholder?`, `modelValue: string[] = []` (v-model) | — | — | Chip input: Enter/comma adds, Backspace on empty draft pops the last tag, optional suggestion pills. |
| **Textarea** | `id?`, `placeholder?`, `rows? = 4`, `required?`, `disabled?`, `dir?: 'ltr'\|'rtl'`, `invalid?`, `modelValue: string \| number` (v-model) | — | — | Mirrors `Input`'s API and invalid-state styling. |
| **Toaster** | — | — | — | Mount **once** per app (e.g. in your root layout). Calls `useToast().wireFlash()` internally to mirror server flash toasts. |
| **Toggle** | `id?`, `modelValue: boolean = false` (v-model) | — | — | Switch (`role="switch"`), RTL-aware knob direction. |
| **FilterBar** | — | default | — | Card row wrapper for filter controls (search input, selects) on index/report pages. |
| **Alert** | `tone?: 'info'\|'success'\|'warning'\|'danger' = 'info'`, `title?: string`, `dismissible? = false` | default (body) | — | Inline banner. **Not** a toast — use for persistent page-level notices; `Toaster` is for transient flash. |
| **Avatar** | `src?: string \| null`, `name?: string`, `size?: 'sm'\|'md'\|'lg' = 'md'` | — | — | Image with initials fallback derived from `name`. |
| **Checkbox** | `id?`, `disabled?`, `modelValue: boolean = false` (v-model) | default (label) | — | Single checkbox with a clickable label. For on/off settings prefer `Toggle`; for multi-select lists use `Checkbox`. |
| **DropdownMenu** | `items: MenuItem[]`, `align?: 'start'\|'end' = 'end'` | `#trigger` | `select` | Overflow/action menu (reka-ui). `MenuItem = { label; icon?; href?; danger?; separatorBefore? }`. Use for **>3** row actions; for ≤3 use `RowActions`. Default trigger is a ⋯ button. |
| **RadioGroup** | `options: { value: string; label: string }[]`, `disabled?`, `modelValue: string` (v-model) | — | — | Vertical radio list. |
| **Sheet** | `title?`, `description?`, `side?: 'start'\|'end'\|'top'\|'bottom' = 'end'`, `open: boolean` (v-model) | default, `#footer` | — | Edge-docked drawer (RTL-aware `start`/`end`). Same slot API as `Modal`, slides from an edge instead of centering. |
| **Spinner** | `size?: 'sm'\|'md'\|'lg' = 'md'` | — | — | Standalone brand-colored spinner (the same one `Button`'s `loading` uses). |
| **Tabs** | `tabs: { value: string; label: string }[]`, `modelValue: string` (v-model) | one named slot per `tab.value` | — | Underline tab bar; render each panel in a slot named after its `value`. |
| **Tooltip** | `content?: string`, `side?: 'top'\|'right'\|'bottom'\|'left' = 'top'`, `delay? = 200` | default (trigger), `#content` | — | Hover/focus tooltip (reka-ui). Wrap the trigger in the default slot. |
| **TranslatableField** | `name: string` (dotted path prefix), `errors?: Record<string,string>` (the **whole** `form.errors`), `locales?: (string \| { code; label?; dir? })[] = ['fr','ar']`, `label?`, `required? = false`, `requiredLocale?`, `layout?: 'tabs'\|'grid' = 'tabs'`, `multiline?`, `rows?`, `placeholder?`, `hint?`, `disabled?`, `id?`, `modelValue: Record<string,string>` (v-model) | — | — | One field for a multi-locale **JSON column**. Locale switching as tabs (or side-by-side `grid`); a tab whose locale has an error shows a red dot — essential, since reka-ui unmounts hidden panels. See **Translatable fields** below. |

### Charts (dependency-free SVG; default series color follows `--color-brand-500`)

| Component | Props | Notes |
|---|---|---|
| **BarChart** | `labels: string[]`, `data: number[]`, `color? = var(--color-brand-500)`, `accentPeak? = false`, `maxTicks? = 7` | Vertical bars; `accentPeak` reddens the tallest bar. Past `maxTicks` labels, ticks thin to every Nth, anchored on the last label. |
| **HBarChart** | `labels: string[]`, `data: number[]`, `format?: (v) => string\|number` | Horizontal ranked bars with a palette. |
| **DonutChart** | `labels: string[]`, `data: number[]`, `donut? = true`, `format?` | Donut/pie with a legend. Set `donut=false` for a full pie. |
| **TrendChart** | `series: { label: string; value: number }[]`, `title?: string` | Line + filled-area sparkline-style trend. |

### Composables

| Export | Signature | Notes |
|---|---|---|
| `useToast()` | `{ toasts, push(message, type = 'success'), dismiss(id), wireFlash() }` | `wireFlash()` watches Inertia `page.props.flash.toast` and mirrors it into the local toast queue. Call it once (already wired inside `Toaster`). |
| `useTrans()` | `{ t(key, params?) }` | Reads `page.props.translations` (dot-path keys, `:param` interpolation). Falls back to a small built-in English map (`common.cancel/confirm/showing/details/edit/delete`) when the app doesn't share translations, or to the raw key otherwise. |
| `useClipboard(resetAfter = 1500)` | `{ copied, copy(text) }` | Used internally by `CodeChip`; also usable standalone. |
| `useDebounceFn(fn, delay = 300)` | returns a debounced version of `fn` | Used internally by `SearchInput`. |
| `useDataTable(initialFilters?)` | `{ filters, onSearch(value), sortBy(column), reload() }` | Server-driven search/sort for an index page — reloads the **current pathname** via Inertia `router.get` (no Ziggy `route()` needed). Pair with `SearchInput`, `SortableHeader`, `Pagination`. |
| `useBrandColor(hex, target?)` | applies a brand ramp at runtime | Injects `--color-brand-50…900` derived from a single `hex` onto `:root` (or `target`). Call once on boot for per-tenant white-labeling. No-op on empty `hex`/SSR. See **Theming**. |
| `brandRamp(hex)` | `Record<'--color-brand-*', string>` | Pure — returns the 10 ramp values as CSS `color-mix()` strings (for SSR/inline `<style>` without touching the DOM). |

### `lib` exports

- `toneFor(map, key, fallback = 'neutral')` — look up a domain status string in your own status→tone map, with a safe fallback. Keep the map itself (e.g. `orderStatusTone`) in your app's `lib/badges.ts`, not in the kit.
- Types: `Tone`, `Paginated<T>`, `PaginatedMeta`, `PaginationLink`, `FlashToast`, `ToastType`.

### Escape hatch

Raw reka-ui Dialog primitives are re-exported (`DialogRoot`, `DialogTrigger`, `DialogPortal`, `DialogOverlay`, `DialogContent`, `DialogTitle`, `DialogDescription`, `DialogClose`) for the rare bespoke dialog that doesn't fit `Modal` or `ConfirmDialog`.

## Composition recipes

### Index page (list + search + sort + row actions + delete + pagination)

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { router } from '@inertiajs/vue3';
import {
    Card, FilterBar, SearchInput, DataTable, SortableHeader, StatusBadge,
    RowActions, ConfirmDialog, Pagination, EmptyState, useDataTable, toneFor,
} from '@jibaleysolution/ui';
import { orderStatusTone } from '@/lib/badges';

const props = defineProps<{ orders: Paginated<Order>; filters: { search: string; sort: string; dir: 'asc'|'desc' } }>();
const { filters, onSearch, sortBy } = useDataTable(props.filters);

const deleting = ref<Order | null>(null);
function destroy() {
    router.delete(route('admin.orders.destroy', deleting.value!.id), { onFinish: () => (deleting.value = null) });
}
</script>

<template>
    <FilterBar>
        <SearchInput v-model="filters.search" @search="onSearch" />
    </FilterBar>

    <DataTable>
        <template #head>
            <th class="px-4 py-3"><SortableHeader label="Customer" column="customer" :active="filters.sort" :dir="filters.dir" @sort="sortBy" /></th>
            <th class="px-4 py-3">Status</th>
            <th class="px-4 py-3" />
        </template>
        <template #body>
            <tr v-for="order in orders.data" :key="order.id">
                <td class="px-4 py-3">{{ order.customer }}</td>
                <td class="px-4 py-3"><StatusBadge :label="order.status" :tone="toneFor(orderStatusTone, order.status)" /></td>
                <td class="px-4 py-3">
                    <RowActions :edit-href="route('admin.orders.edit', order.id)" deletable @delete="deleting = order" />
                </td>
            </tr>
        </template>
        <template #footer>
            <EmptyState v-if="!orders.data.length" title="No orders yet" />
            <div class="p-4"><Pagination :meta="orders.meta" /></div>
        </template>
    </DataTable>

    <ConfirmDialog
        :open="deleting !== null"
        tone="danger"
        title="Delete order?"
        @update:open="(v) => !v && (deleting = null)"
        @confirm="destroy"
    />
</template>
```

### Form page (create/edit)

```vue
<script setup lang="ts">
import { useForm } from '@inertiajs/vue3';
import { FormShell, Card, Label, Input, Select, Textarea, Toggle, Button, FieldError } from '@jibaleysolution/ui';

const form = useForm({ name: '', category: '', notes: '', active: true });
function submit() { form.post(route('admin.items.store')); }
</script>

<template>
    <FormShell title="New item" description="Basic details" :back-href="route('admin.items.index')">
        <Card>
            <form class="space-y-5" @submit.prevent="submit">
                <div>
                    <Label for="name">Name</Label>
                    <Input id="name" v-model="form.name" :invalid="!!form.errors.name" />
                    <FieldError :message="form.errors.name" />
                </div>
                <div>
                    <Label for="notes">Notes</Label>
                    <Textarea id="notes" v-model="form.notes" :invalid="!!form.errors.notes" />
                    <FieldError :message="form.errors.notes" />
                </div>
                <Toggle v-model="form.active" />
                <Button type="submit" variant="primary" :loading="form.processing">Save</Button>
            </form>
        </Card>
    </FormShell>
</template>
```

### Toast wiring (once, in your root layout)

```vue
<script setup lang="ts">
import { Toaster } from '@jibaleysolution/ui';
</script>
<template>
    <Toaster />
    <!-- rest of layout -->
</template>
```

Server side, flash a toast the shape `{ type: 'success'|'error'|'info', message: string }` under the `toast` flash key (e.g. Laravel: `session()->flash('toast', ['type' => 'success', 'message' => '...'])`, surfaced to Inertia as `page.props.flash.toast`).

### Modal vs. ConfirmDialog

- **Deleting/destructive/simple yes-no** → `ConfirmDialog` (built-in Cancel/Confirm, `tone="danger"`).
- **Anything else in an overlay** (a small form, a detail view, multi-step content) → `Modal` (bring your own footer buttons via the `#footer` slot).
- **Neither fits** → compose the raw `DialogRoot`/`DialogContent`/etc. primitives re-exported from this package.

## Theming rules

- Brand orange (`--color-brand-500`, `#fc4401`) is reserved for actions/active-state — only `Button`'s `primary` variant, active `SegmentedControl` segment, `Toggle` on-state, and active `Pagination` link use it as a fill.
- Exactly two shadow levels exist: `--shadow-card` (resting) and `--shadow-card-lg` (hover/overlay). Don't introduce `shadow-sm`/`shadow-xl` etc.
- Radius scale: `--radius-md` (0.625rem, controls), `--radius-2xl` (1rem, `.card`), `--radius-3xl` (1.5rem, CTA bands).
- **Light mode only** — there is no dark theme in this system. Don't add `dark:` variants to kit-consuming code.
- **RTL is first-class.** Use logical Tailwind utilities (`ps-`/`pe-`, `ms-`/`me-`, `start-`/`end-`, `text-start`/`text-end`) instead of physical `pl-`/`pr-`/`left-`/`right-`. Directional icons (arrows, chevrons used as "back") need `rtl:rotate-180`. Set `dir` on the document root from the current locale.

## Re-branding (change the brand color)

The default orange is just a default. To ship a different brand color, or to white-label per tenant, override the `--color-brand-*` ramp — every component that fills with brand (`Button` primary, `Toggle`, active `Pagination`/`SegmentedControl`, charts) follows automatically.

- **Static (one brand for the whole app)** — redefine the ramp in your CSS entry, after the theme import:
  ```css
  @import 'tailwindcss';
  @import '@jibaleysolution/ui/theme.css';
  @theme {
      --color-brand-500: #2563eb; /* + 50…900 for the full ramp */
  }
  ```
- **Runtime (per-tenant white-label)** — call `useBrandColor(hex)` once on boot with a hex from the server. It derives the whole 50→900 ramp from that one color and injects it onto `:root`, so tinted elements re-theme live with no rebuild:
  ```ts
  import { useBrandColor } from '@jibaleysolution/ui';
  import { usePage } from '@inertiajs/vue3';
  // e.g. in your root layout setup:
  useBrandColor(usePage().props.branding?.brand_color); // no-op if absent
  ```

## Translatable (multi-locale JSON) fields

For a column that stores `{"fr": "…", "ar": "…"}`, use **one `TranslatableField`** — never a pair of hand-rolled `Input`s bound to `form.name.fr` / `form.name.ar`.

```vue
<TranslatableField
    v-model="form.name"
    name="name"
    :label="t('category.name')"
    :locales="['fr', 'ar', 'en']"
    :errors="form.errors"
    required
    required-locale="fr"
/>
```

- **`name` is a dotted path prefix**, not just a label. Errors resolve as `errors[`${name}.${locale}`]`, which is exactly what Laravel emits for `'name.fr' => ['required']`. Inside a `Repeater`, interpolate the runtime index: `` :name="`option_groups.${gi}.options.${oi}.name`" ``.
- **`errors` takes the whole `form.errors` bag**, not a single message.
- **JSON contract:** the component re-emits a new object containing **every** configured locale as a string (`''`, never null) on each keystroke, and preserves locales already on the value that aren't in `locales`. Inertia drops keys missing from the object, so this is what stops a locale silently vanishing from the JSON column. **Never `JSON.stringify` a translations object and never add `transform()`** — Inertia already sends a nested object, and with a file attached it serializes to `name[fr]`, which PHP re-parses into an array.
- **`requiredLocale` defaults to the Inertia `locale` page prop**, i.e. the *viewer's* UI language. If your backend always requires one fixed locale (`'name.fr' => ['required']`), **pass it explicitly** — otherwise an Arabic-speaking admin sees the asterisk on `ar` while the server still rejects an empty `fr`.
- `required` gates every required affordance, so omit it for fields the server marks `nullable`.

## Translation contract

Components that render built-in copy (`ConfirmDialog`'s Cancel/Confirm, `Pagination`'s "Showing X–Y of Z", `RowActions`' tooltips) call `useTrans()`, which reads `page.props.translations`. Share these keys from your backend for localized copy: `common.cancel`, `common.confirm`, `common.showing` (with `:from`/`:to`/`:total` placeholders), `common.details`, `common.edit`, `common.delete`. Without them, English fallbacks are used automatically — no crash, no raw keys shown.

# @jibaleysolution/ui

Jibaley ecosystem design system — a Vue 3 + Inertia + reka-ui + Tailwind 4 component kit shared across admin panels (jakil, jibaley-api, kitchen).

44 components (Card, DataTable, StatusBadge, RowActions, DropdownMenu, Tabs, Sheet, Avatar, Alert, Tooltip, Checkbox, RadioGroup, Spinner, form fields, Modal, ConfirmDialog, Pagination, Toaster, 4 SVG charts, and more), 6 composables (`useToast`, `useTrans`, `useClipboard`, `useDebounceFn`, `useDataTable`, `useBrandColor`), and the shared design tokens (`theme.css`). Re-brandable — override the brand ramp statically or per-tenant at runtime.

**▶ Live playground:** [jibaleysolution.github.io/ui-kit](https://jibaleysolution.github.io/ui-kit/) — browse every component with a live brand-color switcher and RTL toggle. Run it locally with `npm run play`.

## Install

```bash
npm install -D @jibaleysolution/ui
```

Peer requirements: `vue ^3.5`, `@inertiajs/vue3 ^2.0`, `reka-ui ^2.10`, `@lucide/vue ^1.25`, Tailwind CSS `>=4.0`.

## Set up the theme

In your CSS entry, import the theme **after** Tailwind:

```css
@import 'tailwindcss';
@import '@jibaleysolution/ui/theme.css';
```

Bring your own fonts — the theme references `Manrope Variable` / `Cairo Variable` by family name (e.g. via `@fontsource-variable/manrope` + `@fontsource-variable/cairo`).

## Use a component

```vue
<script setup lang="ts">
import { Button, Card, StatusBadge } from '@jibaleysolution/ui';
</script>

<template>
    <Card>
        <StatusBadge label="Active" tone="green" />
        <Button variant="primary">Save</Button>
    </Card>
</template>
```

## Set up AI-agent discovery (recommended)

```bash
npx @jibaleysolution/ui init
```

This installs the `jibaley-ui` skill into `.claude/skills/`, `.agents/skills/`, and `.github/skills/`, and prints a snippet to paste into your project's `CLAUDE.md`/`AGENTS.md`. It tells AI coding agents (Claude Code, Codex, Copilot, etc.) to import components from this package instead of rewriting them.

## Full documentation

See [AGENTS.md](./AGENTS.md) for the complete component catalog (props/slots/emits), composition recipes, theming rules, and the translation contract.

## Development

```bash
npm install
npm run typecheck
npm run build
```

`src/` holds the source (components, composables, lib). `theme.css` is static and shipped as-is. `npm run build` compiles `src/` to `dist/` (ESM + per-component `.d.ts`); Vue, Inertia, reka-ui, and `@lucide/vue` are external — they're expected to be provided by the consuming app.

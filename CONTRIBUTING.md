# Contributing to @jibaleysolution/ui

Thanks for helping improve the Jibaley design system. This kit is shared across the ecosystem's admin panels (jakil, jibaley-api, kitchen), so consistency matters more than cleverness.

## Getting started

```bash
git clone git@github.com:jibaleysolution/ui-kit.git
cd ui-kit
npm install
npm run play        # live playground at http://localhost:6006
npm run test        # Vitest smoke suite
npm run typecheck   # vue-tsc
npm run build       # compile dist/ (ESM + d.ts)
```

## Design rules (non-negotiable)

- **Tokens, not hex.** Use the theme scale (`bg-brand-500`, `text-ink`, `border-border`, `shadow-card`) — never hardcoded colors. This keeps re-branding (`useBrandColor`) working.
- **Light mode only.** No `dark:` variants.
- **RTL-first.** Use logical utilities (`ps-`/`pe-`, `ms-`/`me-`, `start-`/`end-`, `text-start`/`text-end`), never physical (`pl-`/`left-`). Directional icons need `rtl:rotate-180`.
- **Two shadows** (`--shadow-card`, `--shadow-card-lg`) and the fixed radius scale — don't introduce new elevation or radius steps.
- **Behavioral primitives come from reka-ui** (already a dependency) for anything needing focus-trap / keyboard nav / ARIA (dialogs, menus, tabs, tooltips). Don't hand-roll them.
- **No Ziggy `route()` inside components** — the kit must stay app-agnostic. Server-driven helpers reuse the current pathname (see `useDataTable`).

## Adding a component

1. Create `src/components/YourComponent.vue` (SFC, `<script setup lang="ts">`), matching the house style of a sibling component.
2. Export it from `src/components` via `src/index.ts` (keep the list alphabetical).
3. Add a section to the playground gallery (`playground/App.vue`) so it renders live.
4. Add a smoke test to `tests/smoke.spec.ts` (mount + one meaningful assertion).
5. Document it: a row in the catalog in `AGENTS.md` (then `cp AGENTS.md CLAUDE.md` — they must stay byte-identical) and in `skills/jibaley-ui/references/components.md`.
6. `npm run typecheck && npm run test && npm run build` must all pass.

## Commits & PRs

- Conventional Commits (`feat:`, `fix:`, `docs:`, `refactor:`, `ci:`…).
- CI (typecheck + test + build) runs on every PR and must be green before merge.
- Keep `AGENTS.md` and `CLAUDE.md` identical, and bump the docs when you change a public API.

## Releasing (maintainers)

```bash
npm version patch   # or minor / major — bumps package.json and tags
git push --follow-tags
```

The pushed `v*.*.*` tag triggers the **Publish** workflow, which runs the full quality gate (`prepublishOnly`) and publishes to npm. Pushes that touch `src/`, `theme.css`, or `playground/` redeploy the [live playground](https://jibaleysolution.github.io/ui-kit/). Update `CHANGELOG.md` with each release.

- **No npm token.** Publishing uses npm [trusted publishing](https://docs.npmjs.com/trusted-publishers): npm trusts `.github/workflows/publish.yml` in this repository, and adds a provenance statement to each version. The one-time setting lives on npmjs.com, in the package's Settings → Trusted publishing → GitHub Actions: organization `jibaleysolution`, repository `ui-kit`, workflow filename `publish.yml`, no environment, npm publish allowed. Renaming the workflow file or the repository stops publishing until that setting is updated.
- **Version already bumped by hand?** `npm version` would bump it again. Tag it yourself (`git tag -a vX.Y.Z -m "X.Y.Z"`), then push with `--follow-tags`. The workflow refuses a tag that does not match `package.json`.
- **Tagged but not on npm** (a publish that failed): run the workflow by hand from `master` with `gh workflow run publish.yml --repo jibaleysolution/ui-kit --ref master`. It refuses unless the tag exists and `master` still ships the same package as the tag.

## Questions / security

General questions and security reports: **engineering@jibaley.com** (see [SECURITY.md](./SECURITY.md)). Please don't file public issues for vulnerabilities.

/**
 * Runtime brand-color theming for white-labeling.
 *
 * The kit's brand ramp (`--color-brand-50…900`) is a hand-tuned orange by
 * default. Call `useBrandColor(hex)` once on app boot to retint the whole ramp
 * from a single base color — e.g. a per-tenant `brand_color` pulled from the
 * server. Tailwind 4 utilities (`bg-brand-500`, `text-brand-600`, …) reference
 * these custom properties, so every tinted element updates live with no rebuild.
 */

const SHADES = {
    50: 'color-mix(in oklab, {c}, white 90%)',
    100: 'color-mix(in oklab, {c}, white 80%)',
    200: 'color-mix(in oklab, {c}, white 60%)',
    300: 'color-mix(in oklab, {c}, white 40%)',
    400: 'color-mix(in oklab, {c}, white 20%)',
    500: '{c}',
    600: 'color-mix(in oklab, {c}, black 12%)',
    700: 'color-mix(in oklab, {c}, black 28%)',
    800: 'color-mix(in oklab, {c}, black 44%)',
    900: 'color-mix(in oklab, {c}, black 58%)',
} as const;

export type BrandRamp = Record<`--color-brand-${keyof typeof SHADES}`, string>;

/**
 * Derive the 10 `--color-brand-*` values from a single base color, as CSS
 * `color-mix()` strings (the browser computes the mix — no color-space math).
 * Pure: use it to build an inline `<style>`/SSR payload without touching the DOM.
 */
export function brandRamp(hex: string): BrandRamp {
    const ramp = {} as BrandRamp;
    for (const [shade, template] of Object.entries(SHADES)) {
        ramp[`--color-brand-${shade}` as keyof BrandRamp] = template.replace('{c}', hex);
    }
    return ramp;
}

/**
 * Apply a brand color at runtime by writing the derived ramp onto `target`
 * (defaults to `:root`). Inline custom properties on the element win over the
 * stylesheet `@theme` values, so this overrides the default orange. No-op when
 * `hex` is empty or there's no DOM (SSR).
 */
export function useBrandColor(hex: string | null | undefined, target?: HTMLElement): void {
    if (!hex || typeof document === 'undefined') {
        return;
    }

    const el = target ?? document.documentElement;
    for (const [prop, value] of Object.entries(brandRamp(hex))) {
        el.style.setProperty(prop, value);
    }
}

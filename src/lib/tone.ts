import type { Tone } from './types';

/**
 * Look up a domain status string in an app-owned status→tone map. Apps keep
 * their own map (e.g. `orderStatusTone`); this just centralizes the fallback.
 */
export function toneFor<K extends string>(
    map: Record<K, Tone>,
    key: K | string | null | undefined,
    fallback: Tone = 'neutral',
): Tone {
    if (key == null) {
        return fallback;
    }

    return (map as Record<string, Tone>)[key] ?? fallback;
}

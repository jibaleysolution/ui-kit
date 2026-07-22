import { usePage } from '@inertiajs/vue3';

const FALLBACKS: Record<string, string> = {
    'common.cancel': 'Cancel',
    'common.confirm': 'Confirm',
    'common.showing': 'Showing :from–:to of :total',
    'common.details': 'Details',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
};

/**
 * Resolve a dot-path key out of the shared `translations` page prop and
 * interpolate `:param` placeholders. Falls back to a built-in English string
 * (or the key itself) when the host app doesn't share translations —
 * `usePage()` is wrapped so the kit still works outside an Inertia page.
 */
export function useTrans() {
    const t = (key: string, params: Record<string, string | number> = {}): string => {
        let dict: Record<string, unknown> | undefined;

        try {
            dict = usePage().props.translations as Record<string, unknown> | undefined;
        } catch {
            dict = undefined;
        }

        const raw = key
            .split('.')
            .reduce<unknown>(
                (node, part) =>
                    node && typeof node === 'object' ? (node as Record<string, unknown>)[part] : undefined,
                dict,
            );

        let out = typeof raw === 'string' ? raw : (FALLBACKS[key] ?? key);

        // Replace longer placeholder names first so one name that is a prefix of
        // another (e.g. `:to` vs `:total`) can't corrupt the longer token.
        for (const [name, value] of Object.entries(params).sort((a, b) => b[0].length - a[0].length)) {
            out = out.replaceAll(`:${name}`, String(value));
        }

        return out;
    };

    return { t };
}

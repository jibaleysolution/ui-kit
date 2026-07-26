/** Locale codes whose script runs right-to-left (primary subtag). */
const RTL_LANGUAGES = new Set([
    'ar', // Arabic
    'he', // Hebrew
    'fa', // Persian
    'ur', // Urdu
    'ps', // Pashto
    'sd', // Sindhi
    'ug', // Uyghur
    'yi', // Yiddish
    'dv', // Divehi
    'ckb', // Central Kurdish
]);

/**
 * Text direction for a locale code. Matches on the primary subtag, so regional
 * variants work too (`ar-MA` → rtl, `fr-CA` → ltr).
 */
export function dirForLocale(code: string): 'ltr' | 'rtl' {
    return RTL_LANGUAGES.has(code.toLowerCase().split(/[-_]/)[0]) ? 'rtl' : 'ltr';
}

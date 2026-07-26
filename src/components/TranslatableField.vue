<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { usePage } from '@inertiajs/vue3';
import Label from './Label.vue';
import Input from './Input.vue';
import Textarea from './Textarea.vue';
import FieldError from './FieldError.vue';
import Tabs from './Tabs.vue';
import { dirForLocale } from '../lib/locale';

export interface TranslatableLocale {
    code: string;
    label?: string;
    dir?: 'ltr' | 'rtl';
}

/** The shape a translatable JSON column takes in a form: `{ fr: '…', ar: '…' }`. */
export type TranslatableValue = Record<string, string>;

const props = withDefaults(
    defineProps<{
        /**
         * Dotted path prefix of the field, used to look errors up as
         * `errors[`${name}.${locale}`]`. Supports nested paths with runtime
         * indices, e.g. `option_groups.0.options.2.name`.
         */
        name: string;
        /** The whole Inertia `form.errors` bag — not a single message. */
        errors?: Record<string, string>;
        locales?: (string | TranslatableLocale)[];
        label?: string;
        /** Gates every required affordance (asterisks + the HTML attribute). */
        required?: boolean;
        /**
         * Which locale must be filled. Defaults to the Inertia `locale` page
         * prop — note that in apps where the backend always requires one fixed
         * locale, pass it explicitly (e.g. `required-locale="fr"`), since the
         * page prop follows the *viewer's* UI language.
         */
        requiredLocale?: string;
        layout?: 'tabs' | 'grid';
        multiline?: boolean;
        rows?: number;
        placeholder?: string;
        hint?: string;
        disabled?: boolean;
        id?: string;
    }>(),
    { locales: () => ['fr', 'ar'], layout: 'tabs', required: false, multiline: false, disabled: false },
);

const model = defineModel<TranslatableValue>({ default: () => ({}) });

const normalized = computed<Required<TranslatableLocale>[]>(() =>
    props.locales.map((entry) => {
        const locale = typeof entry === 'string' ? { code: entry } : entry;
        return {
            code: locale.code,
            label: locale.label ?? locale.code.toUpperCase(),
            dir: locale.dir ?? dirForLocale(locale.code),
        };
    }),
);

const requiredCode = computed(() => {
    if (props.requiredLocale) {
        return props.requiredLocale;
    }

    let pageLocale: unknown;
    try {
        pageLocale = usePage().props.locale;
    } catch {
        pageLocale = undefined;
    }

    const codes = normalized.value.map((locale) => locale.code);

    return typeof pageLocale === 'string' && codes.includes(pageLocale)
        ? pageLocale
        : (codes[0] ?? '');
});

const baseId = computed(() => (props.id ?? props.name).replace(/[^A-Za-z0-9_-]+/g, '-'));
const idFor = (code: string) => `${baseId.value}-${code}`;

const errorFor = (code: string) => props.errors?.[`${props.name}.${code}`];
const groupError = computed(() => props.errors?.[props.name]);

const valueOf = (code: string) => {
    const raw = model.value?.[code];
    return typeof raw === 'string' ? raw : '';
};

/**
 * Rebuild the whole map on every write. Inertia drops keys that are absent from
 * the object (and coerces null/undefined to ''), so every configured locale must
 * always be present as a string or the JSON column silently loses a locale.
 * Emitting a new object identity also keeps Inertia's dirty-tracking honest.
 * Locales stored on the value but not configured here (e.g. a legacy `en`) are
 * preserved rather than dropped.
 */
function setValue(code: string, next: string) {
    const out: TranslatableValue = {};

    for (const [key, value] of Object.entries(model.value ?? {})) {
        out[key] = typeof value === 'string' ? value : '';
    }
    for (const locale of normalized.value) {
        out[locale.code] ??= '';
    }
    out[code] = next;

    model.value = out;
}

const active = ref(normalized.value[0]?.code ?? '');

// After a failed submit, surface the first offending locale — but never yank the
// user away from a tab that is itself showing an error.
watch(
    () => normalized.value.map((locale) => (errorFor(locale.code) ? '1' : '0')).join(''),
    () => {
        if (!errorFor(active.value)) {
            active.value = normalized.value.find((locale) => errorFor(locale.code))?.code ?? active.value;
        }
    },
);

const tabItems = computed(() => normalized.value.map((locale) => ({ value: locale.code, label: locale.label })));

// 3+ locales need a third column; these must stay literal strings so Tailwind's
// source scanner can see them.
const gridCols = computed(() =>
    normalized.value.length >= 3 ? 'sm:grid-cols-2 lg:grid-cols-3' : 'sm:grid-cols-2',
);
</script>

<template>
    <div>
        <Label v-if="label" :for="idFor(layout === 'tabs' ? active : normalized[0]?.code ?? '')">
            {{ label }}
            <span v-if="required" class="text-brand-500">*</span>
        </Label>

        <!-- Tabs: one locale visible at a time. reka-ui unmounts inactive panels,
             so an error on a hidden locale is invisible without the dot below —
             and an HTML `required` on a hidden input can't block submission. -->
        <Tabs v-if="layout === 'tabs'" v-model="active" :tabs="tabItems">
            <template #tab-label="{ tab }">
                <span :class="errorFor(tab.value) ? 'text-red-600' : ''">{{ tab.label }}</span>
                <span v-if="required && tab.value === requiredCode" class="text-brand-500" aria-hidden="true">*</span>
                <span v-if="errorFor(tab.value)" class="size-1.5 rounded-full bg-red-500" aria-hidden="true" />
                <span v-if="errorFor(tab.value)" class="sr-only">— error</span>
            </template>

            <template v-for="locale in normalized" :key="locale.code" #[locale.code]>
                <component
                    :is="multiline ? Textarea : Input"
                    :id="idFor(locale.code)"
                    :model-value="valueOf(locale.code)"
                    :dir="locale.dir"
                    :rows="multiline ? rows : undefined"
                    :placeholder="placeholder"
                    :required="required && locale.code === requiredCode"
                    :disabled="disabled"
                    :invalid="!!errorFor(locale.code)"
                    @update:model-value="setValue(locale.code, String($event ?? ''))"
                />
                <FieldError :message="errorFor(locale.code)" />
            </template>
        </Tabs>

        <!-- Grid: every locale side by side. -->
        <div v-else class="grid gap-3" :class="gridCols">
            <div v-for="locale in normalized" :key="locale.code">
                <label :for="idFor(locale.code)" class="mb-1 block text-xs font-medium uppercase text-muted">
                    {{ locale.label }}
                    <span v-if="required && locale.code === requiredCode" class="text-brand-500">*</span>
                </label>
                <component
                    :is="multiline ? Textarea : Input"
                    :id="idFor(locale.code)"
                    :model-value="valueOf(locale.code)"
                    :dir="locale.dir"
                    :rows="multiline ? rows : undefined"
                    :placeholder="placeholder"
                    :required="required && locale.code === requiredCode"
                    :disabled="disabled"
                    :invalid="!!errorFor(locale.code)"
                    @update:model-value="setValue(locale.code, String($event ?? ''))"
                />
                <FieldError :message="errorFor(locale.code)" />
            </div>
        </div>

        <FieldError :message="groupError" />
        <p v-if="hint" class="mt-1.5 text-xs text-muted">{{ hint }}</p>
    </div>
</template>

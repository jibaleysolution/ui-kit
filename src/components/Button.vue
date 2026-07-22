<script setup lang="ts">
import { computed } from 'vue';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type Size = 'sm' | 'md';

const props = withDefaults(
    defineProps<{
        variant?: Variant;
        size?: Size;
        type?: 'button' | 'submit' | 'reset';
        loading?: boolean;
        disabled?: boolean;
    }>(),
    { variant: 'secondary', size: 'md', type: 'button', loading: false, disabled: false },
);

const base =
    'inline-flex items-center justify-center gap-2 rounded-md font-semibold whitespace-nowrap transition-colors disabled:opacity-50 disabled:pointer-events-none select-none';

const sizes: Record<Size, string> = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-10 px-4 text-sm',
};

// Only the primary button is filled brand-orange; everything else is outline/ghost/secondary.
const variants: Record<Variant, string> = {
    primary: 'bg-brand-500 text-white hover:bg-brand-600 shadow-card',
    secondary: 'bg-white text-ink border border-border hover:bg-canvas',
    outline: 'bg-transparent text-ink border border-border hover:bg-canvas',
    ghost: 'bg-transparent text-muted hover:bg-canvas hover:text-ink',
    danger: 'bg-transparent text-red-600 border border-red-200 hover:bg-red-50',
};

const classes = computed(() => [base, sizes[props.size], variants[props.variant]]);
</script>

<template>
    <button :type="type" :class="classes" :disabled="disabled || loading">
        <svg
            v-if="loading"
            class="size-4 animate-spin"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
        >
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
        <slot />
    </button>
</template>

<script setup lang="ts">
import { Check, Copy } from '@lucide/vue';
import { useClipboard } from '../composables/useClipboard';

withDefaults(defineProps<{ value: string; tone?: 'default' | 'inverse'; copyable?: boolean }>(), {
    tone: 'default',
    copyable: true,
});

const { copied, copy } = useClipboard();
</script>

<template>
    <span
        class="inline-flex max-w-full items-center gap-1.5 rounded-md px-2 py-1 font-mono text-xs"
        :class="
            tone === 'inverse'
                ? 'bg-white/15 text-white'
                : 'bg-canvas text-ink ring-1 ring-inset ring-border'
        "
    >
        <span class="truncate">{{ value }}</span>
        <button
            v-if="copyable"
            type="button"
            class="shrink-0 opacity-70 transition-opacity hover:opacity-100"
            :aria-label="'copy'"
            @click="copy(value)"
        >
            <Check v-if="copied" class="size-3.5" />
            <Copy v-else class="size-3.5" />
        </button>
    </span>
</template>

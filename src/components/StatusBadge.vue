<script setup lang="ts">
import { computed } from 'vue';
import type { Tone } from '../lib/types';

const props = withDefaults(defineProps<{ label: string; tone?: Tone; dot?: boolean }>(), {
    tone: 'neutral',
    dot: true,
});

const tones: Record<Tone, { pill: string; dot: string }> = {
    green: { pill: 'bg-emerald-50 text-emerald-700 ring-emerald-600/10', dot: 'bg-emerald-500' },
    red: { pill: 'bg-red-50 text-red-700 ring-red-600/10', dot: 'bg-red-500' },
    amber: { pill: 'bg-amber-50 text-amber-700 ring-amber-600/10', dot: 'bg-amber-500' },
    sky: { pill: 'bg-sky-50 text-sky-700 ring-sky-600/10', dot: 'bg-sky-500' },
    teal: { pill: 'bg-teal-50 text-teal-700 ring-teal-600/10', dot: 'bg-teal-500' },
    neutral: { pill: 'bg-canvas text-muted ring-border', dot: 'bg-muted' },
};

const style = computed(() => tones[props.tone]);
</script>

<template>
    <span
        class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset"
        :class="style.pill"
    >
        <span v-if="dot" class="size-1.5 rounded-full" :class="style.dot" />
        {{ label }}
    </span>
</template>

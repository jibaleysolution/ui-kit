<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
    defineProps<{
        labels: string[];
        data: number[];
        color?: string;
        // Optional per-bar accent (e.g. peak-hour intensity). Falls back to `color`.
        accentPeak?: boolean;
    }>(),
    { color: 'var(--color-brand-500)', accentPeak: false },
);

const max = computed(() => Math.max(1, ...props.data.map(Number)));
const bars = computed(() =>
    props.labels.map((label, i) => {
        const value = Number(props.data[i] ?? 0);
        const pct = (value / max.value) * 100;
        const color = props.accentPeak && value === max.value && value > 0 ? '#ef4444' : props.color;
        return { label, value, pct, color };
    }),
);
</script>

<template>
    <div class="flex h-56 items-end gap-1.5">
        <div v-for="bar in bars" :key="bar.label" class="flex flex-1 flex-col items-center gap-1">
            <div class="flex w-full flex-1 items-end">
                <div
                    class="w-full rounded-t transition-all"
                    :style="{ height: Math.max(bar.pct, bar.value > 0 ? 4 : 0) + '%', backgroundColor: bar.color }"
                    :title="`${bar.label}: ${bar.value}`"
                />
            </div>
            <span class="origin-left -rotate-45 whitespace-nowrap text-[10px] text-muted sm:rotate-0">{{ bar.label }}</span>
        </div>
        <p v-if="!bars.length" class="w-full py-8 text-center text-sm text-muted">—</p>
    </div>
</template>

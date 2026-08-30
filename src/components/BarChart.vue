<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
    defineProps<{
        labels: string[];
        data: number[];
        color?: string;
        // Optional per-bar accent (e.g. peak-hour intensity). Falls back to `color`.
        accentPeak?: boolean;
        // Densest label count before ticks are thinned (every Nth kept, anchored on the last label).
        maxTicks?: number;
    }>(),
    { color: 'var(--color-brand-500)', accentPeak: false, maxTicks: 7 },
);

const max = computed(() => Math.max(1, ...props.data.map(Number)));
const step = computed(() => Math.max(1, Math.ceil(props.labels.length / props.maxTicks)));
const bars = computed(() =>
    props.labels.map((label, i) => {
        const value = Number(props.data[i] ?? 0);
        const pct = (value / max.value) * 100;
        const color = props.accentPeak && value === max.value && value > 0 ? '#ef4444' : props.color;
        const ticked = (props.labels.length - 1 - i) % step.value === 0;
        return { label, value, pct, color, ticked };
    }),
);
</script>

<template>
    <div class="flex h-56 gap-1.5">
        <!--
            No `items-end` on the row: columns must stretch to the row's h-56 so the bar
            area's flex-1 resolves to a definite height — a percentage bar height inside a
            content-sized column computes to 0 and no bar ever renders. min-w-0 lets a
            column shrink below its label's width, so many labels never overflow the row.
        -->
        <div v-for="bar in bars" :key="bar.label" class="flex min-w-0 flex-1 flex-col items-center gap-1">
            <div class="flex w-full flex-1 items-end">
                <div
                    class="w-full rounded-t transition-all"
                    :style="{ height: Math.max(bar.pct, bar.value > 0 ? 4 : 0) + '%', backgroundColor: bar.color }"
                    :title="`${bar.label}: ${bar.value}`"
                />
            </div>
            <!-- Fixed-height slot keeps every bar area equal; a thinned tick's label may center-overflow its own narrow column into its unlabelled neighbours. -->
            <div class="flex h-4 w-full justify-center">
                <span v-if="bar.ticked" class="whitespace-nowrap text-[10px] text-muted" :title="bar.label">{{ bar.label }}</span>
            </div>
        </div>
        <p v-if="!bars.length" class="w-full self-center py-8 text-center text-sm text-muted">—</p>
    </div>
</template>

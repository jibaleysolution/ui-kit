<script setup lang="ts">
import { computed } from 'vue';

interface Point {
    label: string;
    value: number;
}

// Lightweight hand-drawn line+area chart (no chart-library dependency).
const props = withDefaults(defineProps<{ series: Point[]; title?: string }>(), { title: '' });

const W = 700;
const H = 200;
const PAD = { l: 8, r: 8, t: 12, b: 8 };
const innerW = W - PAD.l - PAD.r;
const innerH = H - PAD.t - PAD.b;

const max = computed(() => Math.max(1, ...props.series.map((p) => Number(p.value) || 0)));

const points = computed(() => {
    const n = props.series.length;
    if (!n) {
        return [];
    }
    return props.series.map((p, i) => {
        const x = n === 1 ? PAD.l + innerW / 2 : PAD.l + (i / (n - 1)) * innerW;
        const y = PAD.t + innerH - ((Number(p.value) || 0) / max.value) * innerH;
        return { x, y };
    });
});

const linePath = computed(() =>
    points.value.map((pt, i) => `${i ? 'L' : 'M'}${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`).join(' '),
);

const areaPath = computed(() => {
    if (!points.value.length) {
        return '';
    }
    const base = PAD.t + innerH;
    const first = points.value[0];
    const last = points.value[points.value.length - 1];
    return `M${first.x.toFixed(1)} ${base} ${points.value
        .map((pt) => `L${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`)
        .join(' ')} L${last.x.toFixed(1)} ${base} Z`;
});

const step = computed(() => Math.max(1, Math.ceil(props.series.length / 7)));
</script>

<template>
    <div class="rounded-lg border border-border bg-card p-4">
        <p v-if="title" class="mb-2 text-xs font-medium text-muted">{{ title }}</p>
        <svg :viewBox="`0 0 ${W} ${H}`" class="w-full" role="img">
            <path :d="areaPath" fill="color-mix(in oklab, var(--color-brand-500), transparent 90%)" />
            <path :d="linePath" fill="none" stroke="var(--color-brand-500)" stroke-width="2" stroke-linejoin="round" />
            <circle
                v-if="points.length"
                :cx="points[points.length - 1].x"
                :cy="points[points.length - 1].y"
                r="3.5"
                fill="var(--color-brand-500)"
            />
        </svg>
        <div class="mt-1 flex justify-between text-[10px] text-muted">
            <span v-for="(p, i) in series" :key="i" :class="i % step !== 0 && i !== series.length - 1 ? 'invisible' : ''">
                {{ p.label }}
            </span>
        </div>
    </div>
</template>

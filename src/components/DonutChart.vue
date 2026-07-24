<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
    defineProps<{
        labels: string[];
        data: number[];
        donut?: boolean;
        format?: (value: number) => string | number;
    }>(),
    { donut: true, format: (v: number) => v },
);

const PALETTE = ['var(--color-brand-500)', '#0ea5e9', '#10b981', '#f59e0b', '#0d9488', '#667085'];
const CX = 80;
const CY = 80;
const R = 70; // outer radius
const IR = 44; // inner radius (donut hole)

const total = computed(() => props.data.reduce((s, v) => s + Number(v || 0), 0));

function point(cx: number, cy: number, r: number, angle: number): [number, number] {
    const a = ((angle - 90) * Math.PI) / 180;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
}

// Annular sector (donut) or wedge (pie) path between two angles.
function arc(startAngle: number, endAngle: number, inner: number): string {
    const large = endAngle - startAngle > 180 ? 1 : 0;
    const [ox1, oy1] = point(CX, CY, R, startAngle);
    const [ox2, oy2] = point(CX, CY, R, endAngle);
    if (inner <= 0) {
        return `M ${CX} ${CY} L ${ox1} ${oy1} A ${R} ${R} 0 ${large} 1 ${ox2} ${oy2} Z`;
    }
    const [ix1, iy1] = point(CX, CY, inner, startAngle);
    const [ix2, iy2] = point(CX, CY, inner, endAngle);
    return `M ${ox1} ${oy1} A ${R} ${R} 0 ${large} 1 ${ox2} ${oy2} L ${ix2} ${iy2} A ${inner} ${inner} 0 ${large} 0 ${ix1} ${iy1} Z`;
}

const inner = computed(() => (props.donut ? IR : 0));

const segments = computed(() => {
    let angle = 0;
    return props.labels.map((label, i) => {
        const value = Number(props.data[i] ?? 0);
        const frac = total.value ? value / total.value : 0;
        const start = angle;
        const end = angle + frac * 360;
        angle = end;
        return {
            label,
            value,
            color: PALETTE[i % PALETTE.length],
            // A lone 100% slice can't be drawn as an arc (start === end) — flag it
            // so the template renders a full <circle> instead.
            full: frac >= 0.999,
            path: arc(start, Math.min(end, 359.999), inner.value),
        };
    });
});
</script>

<template>
    <div class="flex flex-col items-center gap-5 sm:flex-row sm:justify-center">
        <svg viewBox="0 0 160 160" class="size-40 shrink-0">
            <template v-for="seg in segments" :key="seg.label">
                <template v-if="seg.full">
                    <circle :cx="CX" :cy="CY" :r="R" :fill="seg.color" />
                    <circle v-if="donut" :cx="CX" :cy="CY" :r="IR" fill="var(--color-card)" />
                </template>
                <path v-else :d="seg.path" :fill="seg.color" />
            </template>
            <circle
                v-if="!segments.length"
                :cx="CX"
                :cy="CY"
                :r="R"
                fill="none"
                stroke="var(--color-border)"
                :stroke-width="donut ? R - IR : 2"
            />
        </svg>
        <ul class="space-y-1.5 text-sm">
            <li v-for="seg in segments" :key="seg.label" class="flex items-center gap-2">
                <span class="size-3 shrink-0 rounded-sm" :style="{ backgroundColor: seg.color }" />
                <span class="text-muted">{{ seg.label }}</span>
                <span class="ms-auto ps-3 font-semibold tabular-nums text-ink">{{ format(seg.value) }}</span>
            </li>
            <li v-if="!segments.length" class="text-muted">—</li>
        </ul>
    </div>
</template>

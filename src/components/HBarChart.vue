<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
    defineProps<{
        labels: string[];
        data: number[];
        format?: (value: number) => string | number;
    }>(),
    { format: (v: number) => v },
);

const PALETTE = ['var(--color-brand-500)', '#0ea5e9', '#10b981', '#f59e0b', '#0d9488', '#667085'];
const max = computed(() => Math.max(1, ...props.data.map(Number)));
const rows = computed(() =>
    props.labels.map((label, i) => ({
        label,
        value: Number(props.data[i] ?? 0),
        pct: (Number(props.data[i] ?? 0) / max.value) * 100,
        color: PALETTE[i % PALETTE.length],
    })),
);
</script>

<template>
    <div class="space-y-3">
        <div v-for="row in rows" :key="row.label" class="flex items-center gap-3">
            <span class="w-28 shrink-0 truncate text-end text-xs text-muted" :title="row.label">{{ row.label }}</span>
            <div class="h-5 flex-1 overflow-hidden rounded bg-canvas">
                <div class="h-full rounded transition-all" :style="{ width: Math.max(row.pct, 2) + '%', backgroundColor: row.color }" />
            </div>
            <span class="w-14 shrink-0 text-end text-xs font-semibold tabular-nums text-ink">{{ format(row.value) }}</span>
        </div>
        <p v-if="!rows.length" class="py-8 text-center text-sm text-muted">—</p>
    </div>
</template>

<script setup lang="ts">
interface Segment {
    value: string;
    label: string;
}

defineProps<{ segments: Segment[] }>();
const model = defineModel<string>();
</script>

<template>
    <div class="inline-flex items-center gap-0.5 rounded-full border border-border bg-white p-0.5">
        <button
            v-for="seg in segments"
            :key="seg.value"
            type="button"
            class="rounded-full px-3 py-1 text-xs font-semibold transition-colors"
            :class="
                model === seg.value ? 'bg-brand-500 text-white shadow-card' : 'text-muted hover:text-ink'
            "
            @click="model = seg.value"
        >
            {{ seg.label }}
        </button>
    </div>
</template>

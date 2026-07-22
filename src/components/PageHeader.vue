<script setup lang="ts">
defineProps<{ title: string; subtitle?: string }>();
</script>

<template>
    <div class="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div class="min-w-0">
            <div class="flex items-center gap-3">
                <h1 class="truncate text-2xl font-bold tracking-tight text-ink">{{ title }}</h1>
                <slot name="badge" />
            </div>
            <p v-if="subtitle" class="mt-1 text-sm text-muted">{{ subtitle }}</p>
        </div>
        <div class="flex items-center gap-2">
            <slot name="actions" />
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Component } from 'vue';

defineProps<{ label: string; value: string | number; description?: string; icon?: Component }>();
</script>

<template>
    <div class="card card-lift p-5">
        <div class="flex items-start justify-between gap-3">
            <p class="text-sm font-medium text-muted">{{ label }}</p>
            <span
                v-if="icon"
                class="flex size-9 items-center justify-center rounded-md bg-canvas text-muted"
            >
                <component :is="icon" class="size-4.5" />
            </span>
        </div>
        <p class="mt-3 text-3xl font-bold tracking-tight text-ink tabular-nums">{{ value }}</p>
        <p v-if="description" class="mt-1 text-sm text-muted">{{ description }}</p>
    </div>
</template>

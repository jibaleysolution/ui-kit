<script setup lang="ts">
interface Option {
    value: string;
    label: string;
}

defineProps<{ id?: string; options: Option[] }>();
const model = defineModel<string>();
</script>

<template>
    <div class="relative">
        <select
            :id="id"
            v-model="model"
            class="h-10 w-full appearance-none rounded-md border border-border bg-white px-3 pe-9 text-sm text-ink transition-colors focus:border-brand-500"
        >
            <option v-for="opt in options" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
        </select>
        <svg
            class="pointer-events-none absolute end-3 top-1/2 size-4 -translate-y-1/2 text-muted"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            aria-hidden="true"
        >
            <path d="m6 9 6 6 6-6" />
        </svg>
    </div>
</template>

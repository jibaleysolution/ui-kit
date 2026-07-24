<script setup lang="ts">
import { Calendar } from '@lucide/vue';

withDefaults(
    defineProps<{
        id?: string;
        type?: 'date' | 'datetime-local' | 'time' | 'month';
        min?: string;
        max?: string;
        required?: boolean;
        invalid?: boolean;
    }>(),
    { type: 'date' },
);

// ISO string (`YYYY-MM-DD`, or `YYYY-MM-DDTHH:mm` for datetime-local) — maps
// straight to Laravel validation / DB columns.
const model = defineModel<string>();
</script>

<template>
    <div class="relative">
        <Calendar class="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
        <input
            :id="id"
            v-model="model"
            :type="type"
            :min="min"
            :max="max"
            :required="required"
            dir="ltr"
            :aria-invalid="invalid || undefined"
            class="h-10 w-full rounded-md border bg-white ps-9 pe-3 text-sm text-ink transition-colors focus:border-brand-500"
            :class="invalid ? 'border-red-300' : 'border-border'"
        />
    </div>
</template>

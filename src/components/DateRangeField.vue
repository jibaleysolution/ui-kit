<script setup lang="ts">
import { ArrowRight } from '@lucide/vue';
import DateField from './DateField.vue';

export interface DateRange {
    start: string;
    end: string;
}

withDefaults(
    defineProps<{
        type?: 'date' | 'datetime-local' | 'time' | 'month';
        required?: boolean;
        invalid?: boolean;
    }>(),
    { type: 'date' },
);

// `{ start, end }` ISO strings — pass straight to a report/filter query.
const model = defineModel<DateRange>({ default: () => ({ start: '', end: '' }) });
</script>

<template>
    <div class="flex items-center gap-2">
        <DateField v-model="model.start" :type="type" :max="model.end || undefined" :required="required" :invalid="invalid" />
        <ArrowRight class="size-4 shrink-0 text-muted rtl:rotate-180" />
        <DateField v-model="model.end" :type="type" :min="model.start || undefined" :required="required" :invalid="invalid" />
    </div>
</template>

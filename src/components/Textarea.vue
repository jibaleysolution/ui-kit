<script setup lang="ts">
defineProps<{
    id?: string;
    placeholder?: string;
    rows?: number;
    required?: boolean;
    disabled?: boolean;
    dir?: 'ltr' | 'rtl';
    invalid?: boolean;
}>();

const model = defineModel<string | number>();
</script>

<template>
    <textarea
        :id="id"
        v-model="model"
        :placeholder="placeholder"
        :rows="rows ?? 4"
        :required="required"
        :disabled="disabled"
        :dir="dir"
        :aria-invalid="invalid || undefined"
        class="w-full rounded-md border bg-white px-3 py-2 text-sm text-ink placeholder:text-muted/70 transition-colors focus:border-brand-500 disabled:cursor-not-allowed disabled:bg-canvas disabled:text-muted/70"
        :class="invalid ? 'border-red-300' : 'border-border'"
    />
</template>

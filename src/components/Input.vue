<script setup lang="ts">
defineProps<{
    id?: string;
    type?: string;
    placeholder?: string;
    autocomplete?: string;
    required?: boolean;
    dir?: 'ltr' | 'rtl';
    invalid?: boolean;
}>();

const model = defineModel<string | number>();
</script>

<template>
    <input
        :id="id"
        v-model="model"
        :type="type ?? 'text'"
        :placeholder="placeholder"
        :autocomplete="autocomplete"
        :required="required"
        :dir="dir"
        :aria-invalid="invalid || undefined"
        class="h-10 w-full rounded-md border bg-white px-3 text-sm text-ink placeholder:text-muted/70 transition-colors focus:border-brand-500"
        :class="invalid ? 'border-red-300' : 'border-border'"
    />
</template>

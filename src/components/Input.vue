<script setup lang="ts">
defineProps<{
    id?: string;
    type?: string;
    placeholder?: string;
    autocomplete?: string;
    required?: boolean;
    disabled?: boolean;
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
        :disabled="disabled"
        :dir="dir"
        :aria-invalid="invalid || undefined"
        class="h-10 w-full rounded-md border bg-white px-3 text-sm text-ink placeholder:text-muted/70 transition-colors focus:border-brand-500 disabled:cursor-not-allowed disabled:bg-canvas disabled:text-muted/70"
        :class="invalid ? 'border-red-300' : 'border-border'"
    />
</template>

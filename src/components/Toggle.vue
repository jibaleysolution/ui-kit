<script setup lang="ts">
const model = defineModel<boolean>({ default: false });
defineProps<{ id?: string }>();
</script>

<template>
    <button
        :id="id"
        type="button"
        role="switch"
        :aria-checked="model"
        class="relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors"
        :class="model ? 'bg-brand-500' : 'bg-border'"
        @click="model = !model"
    >
        <span
            class="inline-block size-5 transform rounded-full bg-white shadow transition-transform"
            :class="model ? 'translate-x-5.5 rtl:-translate-x-5.5' : 'translate-x-0.5 rtl:-translate-x-0.5'"
        />
    </button>
</template>

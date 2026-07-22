<script setup lang="ts">
const model = defineModel<string>({ default: '#fc4401' });
defineProps<{ id?: string }>();
</script>

<template>
    <div class="inline-flex items-center gap-2 rounded-md border border-border bg-white p-1 ps-1">
        <input
            :id="id"
            v-model="model"
            type="color"
            class="size-9 cursor-pointer rounded border-none bg-transparent p-0"
        />
        <input
            v-model="model"
            type="text"
            spellcheck="false"
            class="h-8 w-24 border-none bg-transparent font-mono text-sm uppercase text-ink focus:outline-none"
        />
    </div>
</template>

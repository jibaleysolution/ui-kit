<script setup lang="ts">
import { Inbox } from '@lucide/vue';

defineProps<{ title: string; description?: string }>();
</script>

<template>
    <div class="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
        <span class="flex size-12 items-center justify-center rounded-full bg-canvas text-muted">
            <Inbox class="size-6" />
        </span>
        <div>
            <p class="font-medium text-ink">{{ title }}</p>
            <p v-if="description" class="mt-1 text-sm text-muted">{{ description }}</p>
        </div>
        <slot />
    </div>
</template>

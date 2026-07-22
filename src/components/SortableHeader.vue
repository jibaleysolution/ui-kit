<script setup lang="ts">
import { ChevronsUpDown, ChevronUp, ChevronDown } from '@lucide/vue';

const props = defineProps<{ label: string; column: string; active: string; dir: 'asc' | 'desc' }>();
const emit = defineEmits<{ sort: [column: string] }>();
</script>

<template>
    <button
        type="button"
        class="inline-flex items-center gap-1 font-medium text-muted transition-colors hover:text-ink"
        @click="emit('sort', column)"
    >
        {{ label }}
        <ChevronUp v-if="active === column && dir === 'asc'" class="size-3.5 text-brand-500" />
        <ChevronDown v-else-if="active === column && dir === 'desc'" class="size-3.5 text-brand-500" />
        <ChevronsUpDown v-else class="size-3.5 opacity-50" />
    </button>
</template>

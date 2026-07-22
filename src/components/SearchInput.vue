<script setup lang="ts">
import { ref, watch } from 'vue';
import { Search } from '@lucide/vue';
import { useDebounceFn } from '../composables/useDebounceFn';

const props = withDefaults(
    defineProps<{ modelValue: string; placeholder?: string; delay?: number }>(),
    { delay: 300 },
);
const emit = defineEmits<{ 'update:modelValue': [value: string]; search: [value: string] }>();

const local = ref(props.modelValue);
watch(
    () => props.modelValue,
    (v) => (local.value = v),
);

const emitSearch = useDebounceFn((value: string) => emit('search', value), props.delay);

watch(local, (value) => {
    emit('update:modelValue', value);
    emitSearch(value);
});
</script>

<template>
    <div class="relative w-full max-w-xs">
        <Search class="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
        <input
            v-model="local"
            type="search"
            :placeholder="placeholder"
            class="h-10 w-full rounded-md border border-border bg-white ps-9 pe-3 text-sm text-ink placeholder:text-muted/70 focus:border-brand-500"
        />
    </div>
</template>

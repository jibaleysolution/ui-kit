<script setup lang="ts">
import { CheckboxRoot, CheckboxIndicator } from 'reka-ui';
import { Check } from '@lucide/vue';

defineProps<{ id?: string; disabled?: boolean }>();
const model = defineModel<boolean>({ default: false });
</script>

<template>
    <label
        class="inline-flex cursor-pointer items-center gap-2.5 text-sm text-ink"
        :class="disabled ? 'cursor-not-allowed opacity-50' : ''"
    >
        <CheckboxRoot
            :id="id"
            v-model="model"
            :disabled="disabled"
            class="flex size-5 shrink-0 items-center justify-center rounded-md border border-border bg-white transition-colors data-[state=checked]:border-brand-500 data-[state=checked]:bg-brand-500"
        >
            <CheckboxIndicator class="text-white">
                <Check class="size-3.5" stroke-width="3" />
            </CheckboxIndicator>
        </CheckboxRoot>
        <span v-if="$slots.default"><slot /></span>
    </label>
</template>

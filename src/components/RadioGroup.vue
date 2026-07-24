<script setup lang="ts">
import { RadioGroupRoot, RadioGroupItem, RadioGroupIndicator } from 'reka-ui';

interface Option {
    value: string;
    label: string;
}

defineProps<{ options: Option[]; disabled?: boolean }>();
const model = defineModel<string>();
</script>

<template>
    <RadioGroupRoot v-model="model" :disabled="disabled" class="flex flex-col gap-2.5">
        <label
            v-for="opt in options"
            :key="opt.value"
            class="inline-flex cursor-pointer items-center gap-2.5 text-sm text-ink"
            :class="disabled ? 'cursor-not-allowed opacity-50' : ''"
        >
            <RadioGroupItem
                :value="opt.value"
                class="flex size-5 shrink-0 items-center justify-center rounded-full border border-border bg-white transition-colors data-[state=checked]:border-brand-500"
            >
                <RadioGroupIndicator class="size-2.5 rounded-full bg-brand-500" />
            </RadioGroupItem>
            {{ opt.label }}
        </label>
    </RadioGroupRoot>
</template>

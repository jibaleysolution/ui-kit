<script setup lang="ts">
import { computed } from 'vue';
import { AvatarRoot, AvatarImage, AvatarFallback } from 'reka-ui';

const props = withDefaults(
    defineProps<{ src?: string | null; name?: string; size?: 'sm' | 'md' | 'lg' }>(),
    { size: 'md' },
);

const sizes = { sm: 'size-8 text-xs', md: 'size-10 text-sm', lg: 'size-14 text-base' };

const initials = computed(() =>
    (props.name ?? '')
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((w) => w[0]?.toUpperCase() ?? '')
        .join(''),
);
</script>

<template>
    <AvatarRoot
        class="inline-flex shrink-0 select-none items-center justify-center overflow-hidden rounded-full bg-canvas font-semibold text-muted ring-1 ring-inset ring-border"
        :class="sizes[size]"
    >
        <AvatarImage v-if="src" :src="src" :alt="name" class="size-full object-cover" />
        <AvatarFallback>{{ initials || '?' }}</AvatarFallback>
    </AvatarRoot>
</template>

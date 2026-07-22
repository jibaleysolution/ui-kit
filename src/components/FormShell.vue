<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import { ArrowLeft } from '@lucide/vue';

defineProps<{
    title: string;
    description?: string;
    backHref?: string;
    backLabel?: string;
}>();
</script>

<template>
    <Link
        v-if="backHref"
        :href="backHref"
        class="mb-4 inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink"
    >
        <ArrowLeft class="size-4 rtl:rotate-180" />
        {{ backLabel }}
    </Link>

    <div class="grid gap-8 lg:grid-cols-3">
        <aside class="lg:sticky lg:top-20 lg:col-span-1 lg:self-start">
            <h1 class="text-2xl font-bold tracking-tight text-ink">{{ title }}</h1>
            <p v-if="description" class="mt-2 text-sm leading-relaxed text-muted">{{ description }}</p>
            <slot name="aside" />
        </aside>

        <div class="lg:col-span-2">
            <slot />
        </div>
    </div>
</template>

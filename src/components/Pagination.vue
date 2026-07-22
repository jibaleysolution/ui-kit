<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import { useTrans } from '../composables/useTrans';
import type { PaginatedMeta } from '../lib/types';

defineProps<{ meta: PaginatedMeta }>();
const { t } = useTrans();
</script>

<template>
    <div v-if="meta.total > 0" class="flex flex-wrap items-center justify-between gap-3 pt-2">
        <p class="text-sm text-muted">
            {{ t('common.showing', { from: meta.from ?? 0, to: meta.to ?? 0, total: meta.total }) }}
        </p>
        <nav v-if="meta.last_page > 1" class="flex items-center gap-1">
            <template v-for="(link, i) in meta.links" :key="i">
                <Link
                    v-if="link.url"
                    :href="link.url"
                    preserve-scroll
                    preserve-state
                    class="inline-flex h-9 min-w-9 items-center justify-center rounded-md px-2.5 text-sm transition-colors"
                    :class="
                        link.active
                            ? 'bg-brand-500 text-white'
                            : 'border border-border bg-white text-ink hover:bg-canvas'
                    "
                >
                    <span v-html="link.label" />
                </Link>
                <span
                    v-else
                    class="inline-flex h-9 min-w-9 items-center justify-center px-2.5 text-sm text-muted/60"
                >
                    <span v-html="link.label" />
                </span>
            </template>
        </nav>
    </div>
</template>

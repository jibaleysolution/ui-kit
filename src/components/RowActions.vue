<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import { Eye, SquarePen, Trash2 } from '@lucide/vue';
import { useTrans } from '../composables/useTrans';

/**
 * Standard icon actions for a table row: optional view/edit links, optional
 * delete (emitted — the page owns its confirm dialog), plus a slot for
 * page-specific extras.
 */
defineProps<{
    viewHref?: string;
    editHref?: string;
    deletable?: boolean;
}>();

defineEmits<{ delete: [] }>();

const { t } = useTrans();
</script>

<template>
    <div class="flex items-center justify-end gap-1">
        <slot />
        <Link
            v-if="viewHref"
            :href="viewHref"
            class="flex size-8 items-center justify-center rounded-md text-muted transition-colors hover:bg-canvas hover:text-ink"
            :title="t('common.details')"
        >
            <Eye class="size-4" />
        </Link>
        <Link
            v-if="editHref"
            :href="editHref"
            class="flex size-8 items-center justify-center rounded-md text-muted transition-colors hover:bg-canvas hover:text-ink"
            :title="t('common.edit')"
        >
            <SquarePen class="size-4" />
        </Link>
        <button
            v-if="deletable"
            type="button"
            class="flex size-8 items-center justify-center rounded-md text-muted transition-colors hover:bg-red-50 hover:text-red-600"
            :title="t('common.delete')"
            @click="$emit('delete')"
        >
            <Trash2 class="size-4" />
        </button>
    </div>
</template>

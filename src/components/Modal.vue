<script setup lang="ts">
import {
    DialogRoot,
    DialogPortal,
    DialogOverlay,
    DialogContent,
    DialogTitle,
    DialogDescription,
    DialogClose,
} from 'reka-ui';
import { X } from '@lucide/vue';

const props = withDefaults(
    defineProps<{
        title?: string;
        description?: string;
        size?: 'sm' | 'md' | 'lg' | 'xl';
    }>(),
    { size: 'md' },
);

const open = defineModel<boolean>('open', { default: false });

const maxWidth: Record<NonNullable<typeof props.size>, string> = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
};
</script>

<template>
    <DialogRoot v-model:open="open">
        <DialogPortal>
            <DialogOverlay
                class="fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm data-[state=open]:animate-[fade-in_0.15s_ease]"
            />
            <DialogContent
                class="fixed left-1/2 top-1/2 z-50 w-[90vw] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border bg-card p-6 shadow-card-lg focus:outline-none data-[state=open]:animate-[fade-in_0.15s_ease]"
                :class="maxWidth[size]"
            >
                <DialogClose
                    class="absolute end-4 top-4 flex size-8 items-center justify-center rounded-md text-muted transition-colors hover:bg-canvas hover:text-ink"
                >
                    <X class="size-4" />
                </DialogClose>

                <DialogTitle v-if="title" class="pe-8 text-lg font-semibold text-ink">{{ title }}</DialogTitle>
                <DialogDescription v-if="description" class="mt-2 text-sm text-muted">
                    {{ description }}
                </DialogDescription>

                <div class="mt-4">
                    <slot />
                </div>

                <div v-if="$slots.footer" class="mt-6 flex justify-end gap-3">
                    <slot name="footer" />
                </div>
            </DialogContent>
        </DialogPortal>
    </DialogRoot>
</template>

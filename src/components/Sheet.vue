<script setup lang="ts">
import { ref, computed, watch } from 'vue';
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
        side?: 'start' | 'end' | 'top' | 'bottom';
    }>(),
    { side: 'end' },
);

const open = defineModel<boolean>('open', { default: false });

// Resolve the logical side to a physical edge, RTL-aware. Re-read on each open.
const rtl = ref(false);
watch(
    open,
    (v) => {
        if (v && typeof document !== 'undefined') {
            rtl.value = document.documentElement.dir === 'rtl';
        }
    },
    { immediate: true },
);

const physical = computed<'left' | 'right' | 'top' | 'bottom'>(() => {
    if (props.side === 'top' || props.side === 'bottom') {
        return props.side;
    }
    if (props.side === 'start') {
        return rtl.value ? 'right' : 'left';
    }
    return rtl.value ? 'left' : 'right';
});

const positions = {
    left: 'inset-y-0 left-0 h-full w-[90vw] max-w-sm border-e',
    right: 'inset-y-0 right-0 h-full w-[90vw] max-w-sm border-s',
    top: 'inset-x-0 top-0 w-full max-h-[85vh] border-b',
    bottom: 'inset-x-0 bottom-0 w-full max-h-[85vh] border-t',
};
const anims = {
    left: 'data-[state=open]:animate-[slide-in-left_0.2s_ease]',
    right: 'data-[state=open]:animate-[slide-in-right_0.2s_ease]',
    top: 'data-[state=open]:animate-[slide-in-top_0.2s_ease]',
    bottom: 'data-[state=open]:animate-[slide-in-bottom_0.2s_ease]',
};
</script>

<template>
    <DialogRoot v-model:open="open">
        <DialogPortal>
            <DialogOverlay
                class="fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm data-[state=open]:animate-[fade-in_0.15s_ease]"
            />
            <DialogContent
                class="fixed z-50 flex flex-col border-border bg-card p-6 shadow-card-lg focus:outline-none"
                :class="[positions[physical], anims[physical]]"
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

                <div class="mt-4 flex-1 overflow-y-auto">
                    <slot />
                </div>

                <div v-if="$slots.footer" class="mt-6 flex justify-end gap-3">
                    <slot name="footer" />
                </div>
            </DialogContent>
        </DialogPortal>
    </DialogRoot>
</template>

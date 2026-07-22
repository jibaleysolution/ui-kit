<script setup lang="ts">
import { CheckCircle2, XCircle, Info, X } from '@lucide/vue';
import { useToast } from '../composables/useToast';

const { toasts, dismiss, wireFlash } = useToast();
wireFlash();

const icons = { success: CheckCircle2, error: XCircle, info: Info };
const accents = {
    success: 'text-emerald-500',
    error: 'text-red-500',
    info: 'text-sky-500',
};
</script>

<template>
    <div class="pointer-events-none fixed bottom-4 end-4 z-[60] flex w-full max-w-sm flex-col gap-2">
        <TransitionGroup
            enter-active-class="transition duration-200 ease-out"
            enter-from-class="translate-y-2 opacity-0"
            leave-active-class="transition duration-150 ease-in"
            leave-to-class="translate-y-1 opacity-0"
        >
            <div
                v-for="toast in toasts"
                :key="toast.id"
                class="pointer-events-auto flex items-start gap-3 rounded-xl border border-border bg-card p-4 shadow-card-lg"
            >
                <component :is="icons[toast.type]" class="mt-0.5 size-5 shrink-0" :class="accents[toast.type]" />
                <p class="flex-1 text-sm text-ink">{{ toast.message }}</p>
                <button class="shrink-0 text-muted hover:text-ink" @click="dismiss(toast.id)">
                    <X class="size-4" />
                </button>
            </div>
        </TransitionGroup>
    </div>
</template>

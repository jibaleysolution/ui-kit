<script setup lang="ts">
import { ref } from 'vue';
import { Info, CheckCircle2, AlertTriangle, XCircle, X } from '@lucide/vue';

type Tone = 'info' | 'success' | 'warning' | 'danger';

withDefaults(
    defineProps<{ tone?: Tone; title?: string; dismissible?: boolean }>(),
    { tone: 'info', dismissible: false },
);

const visible = ref(true);

const styles: Record<Tone, { wrap: string; icon: string; comp: typeof Info }> = {
    info: { wrap: 'bg-sky-50 text-sky-800 ring-sky-600/10', icon: 'text-sky-500', comp: Info },
    success: { wrap: 'bg-emerald-50 text-emerald-800 ring-emerald-600/10', icon: 'text-emerald-500', comp: CheckCircle2 },
    warning: { wrap: 'bg-amber-50 text-amber-800 ring-amber-600/10', icon: 'text-amber-500', comp: AlertTriangle },
    danger: { wrap: 'bg-red-50 text-red-800 ring-red-600/10', icon: 'text-red-500', comp: XCircle },
};
</script>

<template>
    <div
        v-if="visible"
        class="flex items-start gap-3 rounded-md p-4 text-sm ring-1 ring-inset"
        :class="styles[tone].wrap"
        role="alert"
    >
        <component :is="styles[tone].comp" class="mt-0.5 size-5 shrink-0" :class="styles[tone].icon" />
        <div class="min-w-0 flex-1">
            <p v-if="title" class="font-semibold">{{ title }}</p>
            <div :class="title ? 'mt-0.5' : ''"><slot /></div>
        </div>
        <button
            v-if="dismissible"
            type="button"
            class="shrink-0 opacity-60 transition-opacity hover:opacity-100"
            aria-label="Dismiss"
            @click="visible = false"
        >
            <X class="size-4" />
        </button>
    </div>
</template>

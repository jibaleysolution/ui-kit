<script setup lang="ts">
import {
    DialogRoot,
    DialogPortal,
    DialogOverlay,
    DialogContent,
    DialogTitle,
    DialogDescription,
} from 'reka-ui';
import Button from './Button.vue';
import { useTrans } from '../composables/useTrans';

withDefaults(
    defineProps<{
        title: string;
        body?: string;
        confirmLabel?: string;
        tone?: 'primary' | 'danger';
        loading?: boolean;
    }>(),
    { tone: 'primary', loading: false },
);

const open = defineModel<boolean>('open', { default: false });
const emit = defineEmits<{ confirm: [] }>();
const { t } = useTrans();
</script>

<template>
    <DialogRoot v-model:open="open">
        <DialogPortal>
            <DialogOverlay
                class="fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm data-[state=open]:animate-[fade-in_0.15s_ease]"
            />
            <DialogContent
                class="fixed left-1/2 top-1/2 z-50 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border bg-card p-6 shadow-card-lg focus:outline-none data-[state=open]:animate-[fade-in_0.15s_ease]"
            >
                <DialogTitle class="text-lg font-semibold text-ink">{{ title }}</DialogTitle>
                <DialogDescription v-if="body" class="mt-2 text-sm text-muted">
                    {{ body }}
                </DialogDescription>
                <div class="mt-6 flex justify-end gap-3">
                    <Button variant="outline" @click="open = false">{{ t('common.cancel') }}</Button>
                    <Button
                        :variant="tone === 'danger' ? 'danger' : 'primary'"
                        :loading="loading"
                        @click="emit('confirm')"
                    >
                        {{ confirmLabel ?? t('common.confirm') }}
                    </Button>
                </div>
            </DialogContent>
        </DialogPortal>
    </DialogRoot>
</template>

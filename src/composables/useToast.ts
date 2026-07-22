import { ref, watch } from 'vue';
import { usePage } from '@inertiajs/vue3';
import type { FlashToast, ToastType } from '../lib/types';

export interface Toast extends FlashToast {
    id: number;
}

const toasts = ref<Toast[]>([]);
let seq = 0;
let wired = false;

export function useToast() {
    const push = (message: string, type: ToastType = 'success') => {
        const id = ++seq;
        toasts.value.push({ id, message, type });
        window.setTimeout(() => dismiss(id), 4000);
    };

    const dismiss = (id: number) => {
        toasts.value = toasts.value.filter((toast) => toast.id !== id);
    };

    /** Mirror server flash toasts into the local queue. Wire once per app. */
    const wireFlash = () => {
        if (wired) {
            return;
        }
        wired = true;

        const page = usePage();
        watch(
            () => (page.props as { flash?: { toast?: FlashToast | null } }).flash?.toast,
            (toast: FlashToast | null | undefined) => {
                if (toast) {
                    push(toast.message, toast.type);
                }
            },
            { immediate: true },
        );
    };

    return { toasts, push, dismiss, wireFlash };
}

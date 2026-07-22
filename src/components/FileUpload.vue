<script setup lang="ts">
import { ref, computed } from 'vue';
import { UploadCloud, X } from '@lucide/vue';

const props = defineProps<{ id?: string; currentUrl?: string | null; accept?: string; hint?: string }>();
const model = defineModel<File | null>();

const localPreview = ref<string | null>(null);

const preview = computed(() => localPreview.value ?? props.currentUrl ?? null);

function onChange(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0] ?? null;
    model.value = file;
    if (localPreview.value) {
        URL.revokeObjectURL(localPreview.value);
    }
    localPreview.value = file ? URL.createObjectURL(file) : null;
}

function clear() {
    model.value = null;
    if (localPreview.value) {
        URL.revokeObjectURL(localPreview.value);
    }
    localPreview.value = null;
}
</script>

<template>
    <div class="flex items-center gap-4">
        <div
            class="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-border bg-canvas"
        >
            <img v-if="preview" :src="preview" alt="" class="size-full object-cover" />
            <UploadCloud v-else class="size-6 text-muted" />
        </div>
        <div class="min-w-0 flex-1">
            <label
                :for="id"
                class="inline-flex h-9 cursor-pointer items-center gap-2 rounded-md border border-border bg-white px-3 text-sm font-medium text-ink transition-colors hover:bg-canvas"
            >
                <UploadCloud class="size-4" />
                <slot>Choose file</slot>
            </label>
            <input :id="id" type="file" :accept="accept ?? 'image/*'" class="sr-only" @change="onChange" />
            <button
                v-if="localPreview"
                type="button"
                class="ms-2 inline-flex h-9 items-center gap-1 rounded-md px-2 text-sm text-muted hover:text-ink"
                @click="clear"
            >
                <X class="size-4" />
            </button>
            <p v-if="hint" class="mt-1.5 text-xs text-muted">{{ hint }}</p>
        </div>
    </div>
</template>

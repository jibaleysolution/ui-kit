<script setup lang="ts">
import { ref } from 'vue';
import { X } from '@lucide/vue';

const props = defineProps<{ id?: string; suggestions?: string[]; placeholder?: string }>();
const model = defineModel<string[]>({ default: () => [] });

const draft = ref('');

function add(value: string) {
    const tag = value.trim();
    if (!tag || model.value.includes(tag)) {
        draft.value = '';
        return;
    }
    model.value = [...model.value, tag];
    draft.value = '';
}

function remove(tag: string) {
    model.value = model.value.filter((t) => t !== tag);
}

function onKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ',') {
        event.preventDefault();
        add(draft.value);
    } else if (event.key === 'Backspace' && !draft.value && model.value.length) {
        model.value = model.value.slice(0, -1);
    }
}

const openSuggestions = () =>
    (props.suggestions ?? []).filter((s) => !model.value.includes(s));
</script>

<template>
    <div>
        <div
            class="flex min-h-10 flex-wrap items-center gap-1.5 rounded-md border border-border bg-white px-2 py-1.5 focus-within:border-brand-500"
        >
            <span
                v-for="tag in model"
                :key="tag"
                class="inline-flex items-center gap-1 rounded-full bg-canvas px-2 py-0.5 text-xs font-medium text-ink ring-1 ring-inset ring-border"
            >
                {{ tag }}
                <button type="button" class="text-muted hover:text-red-500" @click="remove(tag)">
                    <X class="size-3" />
                </button>
            </span>
            <input
                :id="id"
                v-model="draft"
                :placeholder="placeholder"
                class="min-w-24 flex-1 border-0 bg-transparent px-1 text-sm text-ink outline-none placeholder:text-muted/70"
                @keydown="onKeydown"
                @blur="add(draft)"
            />
        </div>
        <div v-if="openSuggestions().length" class="mt-1.5 flex flex-wrap gap-1.5">
            <button
                v-for="s in openSuggestions()"
                :key="s"
                type="button"
                class="rounded-full border border-dashed border-border px-2 py-0.5 text-xs text-muted transition-colors hover:border-brand-500 hover:text-brand-600"
                @click="add(s)"
            >
                + {{ s }}
            </button>
        </div>
    </div>
</template>

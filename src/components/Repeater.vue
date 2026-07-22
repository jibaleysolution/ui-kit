<script setup lang="ts" generic="T">
import { ref } from 'vue';
import { Plus, Trash2, ChevronDown, GripVertical } from '@lucide/vue';
import Button from './Button.vue';

const props = withDefaults(
    defineProps<{
        newItem: () => T;
        addLabel?: string;
        itemLabel?: (item: T, index: number) => string;
        collapsible?: boolean;
        emptyLabel?: string;
    }>(),
    { collapsible: false },
);

const model = defineModel<T[]>({ default: () => [] });

const collapsed = ref<Record<number, boolean>>({});

function add() {
    model.value = [...model.value, props.newItem()];
}

function remove(index: number) {
    model.value = model.value.filter((_, i) => i !== index);
}

function move(index: number, delta: number) {
    const to = index + delta;
    if (to < 0 || to >= model.value.length) {
        return;
    }
    const next = model.value.slice();
    [next[index], next[to]] = [next[to], next[index]];
    model.value = next;
}

function toggle(index: number) {
    collapsed.value = { ...collapsed.value, [index]: !collapsed.value[index] };
}
</script>

<template>
    <div class="space-y-3">
        <div
            v-for="(item, index) in model"
            :key="index"
            class="rounded-xl border border-border bg-canvas/40"
        >
            <div class="flex items-center gap-2 px-3 py-2">
                <button
                    v-if="collapsible"
                    type="button"
                    class="text-muted transition-transform hover:text-ink"
                    :class="collapsed[index] ? '-rotate-90 rtl:rotate-90' : ''"
                    @click="toggle(index)"
                >
                    <ChevronDown class="size-4" />
                </button>
                <span class="flex-1 truncate text-sm font-medium text-ink">
                    {{ itemLabel ? itemLabel(item, index) : `#${index + 1}` }}
                </span>
                <div class="flex items-center gap-0.5">
                    <button
                        type="button"
                        class="rounded p-1 text-muted hover:bg-white hover:text-ink disabled:opacity-30"
                        :disabled="index === 0"
                        @click="move(index, -1)"
                    >
                        <GripVertical class="size-4" />
                    </button>
                    <Button variant="ghost" size="sm" @click="remove(index)">
                        <Trash2 class="size-4 text-red-500" />
                    </Button>
                </div>
            </div>
            <div v-show="!collapsible || !collapsed[index]" class="border-t border-border px-3 py-3">
                <slot name="item" :item="item" :index="index" />
            </div>
        </div>

        <p v-if="!model.length && emptyLabel" class="text-sm text-muted">{{ emptyLabel }}</p>

        <Button variant="outline" size="sm" @click="add">
            <Plus class="size-4" /> {{ addLabel ?? 'Add' }}
        </Button>
    </div>
</template>

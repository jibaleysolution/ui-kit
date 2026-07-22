<script setup lang="ts">
import { computed } from 'vue';
import { Plus, Trash2 } from '@lucide/vue';
import Button from './Button.vue';

const props = defineProps<{
    keyLabel?: string;
    valueLabel?: string;
    addLabel?: string;
}>();

// Backed by a plain object; edited through an ordered list of {key,value} rows.
const model = defineModel<Record<string, string>>({ default: () => ({}) });

interface Row {
    key: string;
    value: string;
}

const rows = computed<Row[]>(() =>
    Object.entries(model.value ?? {}).map(([key, value]) => ({ key, value: value ?? '' })),
);

function commit(next: Row[]) {
    const out: Record<string, string> = {};
    for (const row of next) {
        if (row.key !== '') {
            out[row.key] = row.value;
        }
    }
    model.value = out;
}

function addRow() {
    model.value = { ...(model.value ?? {}), '': '' };
}

function updateKey(index: number, key: string) {
    const next = rows.value.slice();
    next[index] = { ...next[index], key };
    commit(next);
}

function updateValue(index: number, value: string) {
    const next = rows.value.slice();
    next[index] = { ...next[index], value };
    commit(next);
}

function removeRow(index: number) {
    commit(rows.value.filter((_, i) => i !== index));
}
</script>

<template>
    <div class="space-y-2">
        <div v-if="rows.length" class="space-y-2">
            <div v-for="(row, index) in rows" :key="index" class="flex items-center gap-2">
                <input
                    :value="row.key"
                    :placeholder="keyLabel"
                    dir="ltr"
                    class="h-10 w-1/3 rounded-md border border-border bg-white px-3 font-mono text-sm text-ink focus:border-brand-500"
                    @input="updateKey(index, ($event.target as HTMLInputElement).value)"
                />
                <input
                    :value="row.value"
                    :placeholder="valueLabel"
                    dir="ltr"
                    class="h-10 flex-1 rounded-md border border-border bg-white px-3 font-mono text-sm text-ink focus:border-brand-500"
                    @input="updateValue(index, ($event.target as HTMLInputElement).value)"
                />
                <Button variant="ghost" size="sm" @click="removeRow(index)">
                    <Trash2 class="size-4 text-red-500" />
                </Button>
            </div>
        </div>
        <Button variant="outline" size="sm" @click="addRow">
            <Plus class="size-4" /> {{ addLabel ?? 'Add' }}
        </Button>
    </div>
</template>

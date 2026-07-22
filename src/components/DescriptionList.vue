<script setup lang="ts">
interface Row {
    label: string;
    value: string | number | null | undefined;
}

defineProps<{ rows: Row[] }>();
</script>

<template>
    <dl class="grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
        <div v-for="row in rows" :key="row.label" class="min-w-0">
            <dt class="text-xs font-medium uppercase tracking-wide text-muted">{{ row.label }}</dt>
            <dd class="mt-1 truncate text-sm text-ink">
                <slot :name="row.label" :value="row.value">{{ row.value ?? '—' }}</slot>
            </dd>
        </div>
    </dl>
</template>

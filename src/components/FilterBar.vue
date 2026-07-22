<script setup lang="ts">
// Consistent filter row for index/report pages: a resting card whose children
// (labelled inputs, selects) sit on one wrapping baseline.
</script>

<template>
    <div class="card mb-5 flex flex-wrap items-end gap-4 p-4">
        <slot />
    </div>
</template>

<script setup lang="ts">
defineProps<{ class?: string }>();
</script>

<template>
    <div class="animate-pulse rounded-md bg-border/60" :class="$props.class" />
</template>

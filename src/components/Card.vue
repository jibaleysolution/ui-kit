<script setup lang="ts">
withDefaults(defineProps<{ lift?: boolean; padded?: boolean }>(), { lift: false, padded: true });
</script>

<template>
    <div class="card" :class="[lift && 'card-lift', padded && 'p-6']">
        <slot />
    </div>
</template>

<script setup lang="ts">
// Thin wrapper: a card that scrolls its table horizontally on small screens.
</script>

<template>
    <div class="card overflow-hidden p-0">
        <div class="overflow-x-auto">
            <table class="w-full border-collapse text-sm">
                <thead class="border-b border-border bg-canvas/50">
                    <tr class="text-start">
                        <slot name="head" />
                    </tr>
                </thead>
                <tbody class="divide-y divide-border">
                    <slot name="body" />
                </tbody>
            </table>
        </div>
        <slot name="footer" />
    </div>
</template>

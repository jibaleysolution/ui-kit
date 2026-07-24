<script setup lang="ts">
import { TabsRoot, TabsList, TabsTrigger, TabsContent } from 'reka-ui';

interface Tab {
    value: string;
    label: string;
}

defineProps<{ tabs: Tab[] }>();
const model = defineModel<string>();
</script>

<template>
    <TabsRoot v-model="model">
        <TabsList class="flex items-center gap-1 border-b border-border">
            <TabsTrigger
                v-for="tab in tabs"
                :key="tab.value"
                :value="tab.value"
                class="-mb-px border-b-2 border-transparent px-3 py-2 text-sm font-medium text-muted transition-colors hover:text-ink data-[state=active]:border-brand-500 data-[state=active]:text-ink"
            >
                {{ tab.label }}
            </TabsTrigger>
        </TabsList>

        <TabsContent v-for="tab in tabs" :key="tab.value" :value="tab.value" class="pt-4 focus:outline-none">
            <slot :name="tab.value" />
        </TabsContent>
    </TabsRoot>
</template>

<script setup lang="ts">
import type { Component } from 'vue';
import { Link } from '@inertiajs/vue3';
import {
    DropdownMenuRoot,
    DropdownMenuTrigger,
    DropdownMenuPortal,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
} from 'reka-ui';
import { MoreHorizontal } from '@lucide/vue';

export interface MenuItem {
    label: string;
    icon?: Component;
    href?: string;
    danger?: boolean;
    separatorBefore?: boolean;
}

withDefaults(defineProps<{ items: MenuItem[]; align?: 'start' | 'end' }>(), { align: 'end' });
const emit = defineEmits<{ select: [item: MenuItem] }>();
</script>

<template>
    <DropdownMenuRoot>
        <DropdownMenuTrigger as-child>
            <slot name="trigger">
                <button
                    type="button"
                    class="flex size-8 items-center justify-center rounded-md text-muted transition-colors hover:bg-canvas hover:text-ink focus:outline-none data-[state=open]:bg-canvas data-[state=open]:text-ink"
                >
                    <MoreHorizontal class="size-4" />
                </button>
            </slot>
        </DropdownMenuTrigger>
        <DropdownMenuPortal>
            <DropdownMenuContent
                :align="align"
                :side-offset="6"
                class="z-[70] min-w-44 rounded-xl border border-border bg-card p-1.5 shadow-card-lg focus:outline-none data-[state=open]:animate-[fade-in_0.12s_ease]"
            >
                <template v-for="(item, i) in items" :key="i">
                    <DropdownMenuSeparator v-if="item.separatorBefore" class="my-1 h-px bg-border" />
                    <DropdownMenuItem
                        class="flex cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-2 text-sm outline-none transition-colors data-[highlighted]:bg-canvas"
                        :class="item.danger ? 'text-red-600 data-[highlighted]:bg-red-50' : 'text-ink'"
                        @select="emit('select', item)"
                    >
                        <component :is="item.href ? Link : 'div'" :href="item.href" class="flex flex-1 items-center gap-2.5">
                            <component :is="item.icon" v-if="item.icon" class="size-4" />
                            {{ item.label }}
                        </component>
                    </DropdownMenuItem>
                </template>
            </DropdownMenuContent>
        </DropdownMenuPortal>
    </DropdownMenuRoot>
</template>

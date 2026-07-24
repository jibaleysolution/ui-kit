<script setup lang="ts">
import { TooltipProvider, TooltipRoot, TooltipTrigger, TooltipPortal, TooltipContent } from 'reka-ui';

withDefaults(
    defineProps<{ content?: string; side?: 'top' | 'right' | 'bottom' | 'left'; delay?: number }>(),
    { side: 'top', delay: 200 },
);
</script>

<template>
    <TooltipProvider :delay-duration="delay">
        <TooltipRoot>
            <TooltipTrigger as-child>
                <slot />
            </TooltipTrigger>
            <TooltipPortal>
                <TooltipContent
                    :side="side"
                    :side-offset="6"
                    class="z-[70] max-w-xs rounded-md bg-ink px-2.5 py-1.5 text-xs text-white shadow-card-lg data-[state=delayed-open]:animate-[fade-in_0.12s_ease]"
                >
                    <slot name="content">{{ content }}</slot>
                </TooltipContent>
            </TooltipPortal>
        </TooltipRoot>
    </TooltipProvider>
</template>

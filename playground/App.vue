<script setup lang="ts">
import { ref, watch } from 'vue';
import {
    Button, Card, StatusBadge, Alert, Spinner, Checkbox, RadioGroup, Toggle, Avatar,
    Tabs, Tooltip, Modal, Sheet, ConfirmDialog, Input, Select, Textarea, Label,
    StatCard, EmptyState, SegmentedControl, TagsInput, DataTable, SortableHeader,
    DropdownMenu, DateField, DateRangeField, BarChart, HBarChart, DonutChart, TrendChart,
    useBrandColor, type Tone, type DateRange,
} from '@jibaleysolution/ui';
import { Eye, Pencil, Trash2, ShoppingBag } from '@lucide/vue';

// --- Headline: live brand-color theming ---
const brand = ref('#fc4401');
const presets = ['#fc4401', '#2563eb', '#16a34a', '#9333ea', '#e11d48', '#0d9488'];
watch(brand, (hex) => useBrandColor(hex), { immediate: true });

// --- RTL toggle ---
const rtl = ref(false);
watch(rtl, (on) => {
    document.documentElement.dir = on ? 'rtl' : 'ltr';
});

// interactive state
const checked = ref(true);
const radio = ref('a');
const on = ref(true);
const tags = ref(['vue', 'inertia']);
const tab = ref('one');
const seg = ref('list');
const date = ref('2026-07-24');
const range = ref<DateRange>({ start: '2026-07-01', end: '2026-07-31' });
const modalOpen = ref(false);
const sheetOpen = ref(false);
const confirmOpen = ref(false);
const text = ref('');

const tones: Tone[] = ['green', 'amber', 'red', 'sky', 'teal', 'neutral'];
const menuItems = [
    { label: 'View', icon: Eye },
    { label: 'Edit', icon: Pencil },
    { label: 'Delete', icon: Trash2, danger: true, separatorBefore: true },
];
</script>

<template>
    <div class="min-h-screen bg-canvas p-6 text-ink sm:p-10">
        <div class="mx-auto max-w-5xl space-y-8">
            <header class="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 class="text-2xl font-bold tracking-tight">@jibaleysolution/ui</h1>
                    <p class="mt-1 text-sm text-muted">Component playground · v0.2</p>
                </div>
                <div class="flex items-center gap-3">
                    <Toggle v-model="rtl" /><span class="text-sm text-muted">RTL</span>
                </div>
            </header>

            <!-- Brand theming -->
            <Card>
                <h2 class="text-sm font-semibold uppercase tracking-wide text-muted">Live brand color (useBrandColor)</h2>
                <div class="mt-4 flex flex-wrap items-center gap-3">
                    <input type="color" v-model="brand" class="size-10 cursor-pointer rounded-md border border-border" />
                    <button
                        v-for="p in presets"
                        :key="p"
                        class="size-8 rounded-full ring-2 ring-inset ring-white"
                        :style="{ backgroundColor: p }"
                        @click="brand = p"
                    />
                    <code class="ms-2 rounded bg-canvas px-2 py-1 font-mono text-xs">{{ brand }}</code>
                </div>
                <div class="mt-4 flex flex-wrap items-center gap-3">
                    <Button variant="primary">Primary</Button>
                    <Toggle v-model="on" />
                    <SegmentedControl v-model="seg" :segments="[{ value: 'list', label: 'List' }, { value: 'grid', label: 'Grid' }]" />
                    <Spinner />
                    <StatusBadge label="brand follows" tone="green" />
                </div>
            </Card>

            <!-- Buttons -->
            <section class="space-y-3">
                <h2 class="text-sm font-semibold uppercase tracking-wide text-muted">Buttons</h2>
                <div class="flex flex-wrap gap-3">
                    <Button variant="primary">Primary</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="ghost">Ghost</Button>
                    <Button variant="danger">Danger</Button>
                    <Button variant="primary" loading>Loading</Button>
                </div>
            </section>

            <!-- Badges + Alerts -->
            <section class="grid gap-6 sm:grid-cols-2">
                <div class="space-y-3">
                    <h2 class="text-sm font-semibold uppercase tracking-wide text-muted">Status badges</h2>
                    <div class="flex flex-wrap gap-2">
                        <StatusBadge v-for="t in tones" :key="t" :label="t" :tone="t" />
                    </div>
                </div>
                <div class="space-y-3">
                    <h2 class="text-sm font-semibold uppercase tracking-wide text-muted">Alerts</h2>
                    <Alert tone="info" title="Heads up">An inline banner.</Alert>
                    <Alert tone="warning" dismissible>Dismissible warning.</Alert>
                </div>
            </section>

            <!-- Form fields -->
            <section class="space-y-3">
                <h2 class="text-sm font-semibold uppercase tracking-wide text-muted">Form fields</h2>
                <Card>
                    <div class="grid gap-5 sm:grid-cols-2">
                        <div>
                            <Label for="i">Input</Label>
                            <Input id="i" v-model="text" placeholder="Type…" />
                        </div>
                        <div>
                            <Label for="s">Select</Label>
                            <Select id="s" :options="[{ value: '1', label: 'One' }, { value: '2', label: 'Two' }]" />
                        </div>
                        <div class="sm:col-span-2">
                            <Label for="t">Textarea</Label>
                            <Textarea id="t" placeholder="Notes…" />
                        </div>
                        <div class="flex items-center gap-6">
                            <Checkbox v-model="checked">Checkbox</Checkbox>
                            <Toggle v-model="on" />
                        </div>
                        <RadioGroup v-model="radio" :options="[{ value: 'a', label: 'Option A' }, { value: 'b', label: 'Option B' }]" />
                        <div>
                            <Label for="d">Date</Label>
                            <DateField id="d" v-model="date" type="datetime-local" />
                        </div>
                        <div>
                            <Label>Date range</Label>
                            <DateRangeField v-model="range" />
                        </div>
                        <div class="sm:col-span-2">
                            <Label>Tags</Label>
                            <TagsInput v-model="tags" :suggestions="['react', 'svelte']" />
                        </div>
                    </div>
                </Card>
            </section>

            <!-- Avatar, Tooltip, Dropdown, overlays -->
            <section class="space-y-3">
                <h2 class="text-sm font-semibold uppercase tracking-wide text-muted">Display &amp; overlays</h2>
                <div class="flex flex-wrap items-center gap-4">
                    <Avatar name="Ada Lovelace" />
                    <Avatar name="Grace Hopper" size="lg" />
                    <Tooltip content="A helpful hint"><Button variant="outline">Hover me</Button></Tooltip>
                    <DropdownMenu :items="menuItems" />
                    <Button variant="outline" @click="modalOpen = true">Open Modal</Button>
                    <Button variant="outline" @click="sheetOpen = true">Open Sheet</Button>
                    <Button variant="danger" @click="confirmOpen = true">Confirm dialog</Button>
                </div>
            </section>

            <!-- Tabs -->
            <section class="space-y-3">
                <h2 class="text-sm font-semibold uppercase tracking-wide text-muted">Tabs</h2>
                <Tabs v-model="tab" :tabs="[{ value: 'one', label: 'Overview' }, { value: 'two', label: 'Details' }]">
                    <template #one><p class="text-sm text-muted">Overview panel.</p></template>
                    <template #two><p class="text-sm text-muted">Details panel.</p></template>
                </Tabs>
            </section>

            <!-- Stats + table -->
            <section class="space-y-3">
                <h2 class="text-sm font-semibold uppercase tracking-wide text-muted">Stats &amp; table</h2>
                <div class="grid gap-4 sm:grid-cols-3">
                    <StatCard label="Orders" :value="1284" :icon="ShoppingBag" description="+12% this week" />
                    <StatCard label="Revenue" value="₣ 4.2M" />
                    <StatCard label="Customers" :value="312" />
                </div>
                <DataTable>
                    <template #head>
                        <th class="px-4 py-3 text-start"><SortableHeader label="Name" column="name" active="name" dir="asc" /></th>
                        <th class="px-4 py-3 text-start">Status</th>
                    </template>
                    <template #body>
                        <tr><td class="px-4 py-3">Le Sahel</td><td class="px-4 py-3"><StatusBadge label="Open" tone="green" /></td></tr>
                        <tr><td class="px-4 py-3">Chez Fatimé</td><td class="px-4 py-3"><StatusBadge label="Closed" tone="red" /></td></tr>
                    </template>
                </DataTable>
                <EmptyState title="Empty state" description="Shown when a list has no rows." />
            </section>

            <!-- Charts -->
            <section class="space-y-3">
                <h2 class="text-sm font-semibold uppercase tracking-wide text-muted">Charts (follow brand color)</h2>
                <div class="grid gap-6 sm:grid-cols-2">
                    <Card><BarChart :labels="['Mon', 'Tue', 'Wed', 'Thu', 'Fri']" :data="[4, 8, 5, 12, 7]" accent-peak /></Card>
                    <Card><DonutChart :labels="['Cash', 'Card', 'Wallet']" :data="[40, 35, 25]" /></Card>
                    <Card><HBarChart :labels="['Pizza', 'Burger', 'Salad']" :data="[120, 90, 45]" /></Card>
                    <Card class="p-0"><TrendChart title="Orders (14d)" :series="[{ label: '1', value: 3 }, { label: '2', value: 6 }, { label: '3', value: 4 }, { label: '4', value: 9 }, { label: '5', value: 7 }, { label: '6', value: 12 }]" /></Card>
                </div>
            </section>
        </div>

        <Modal v-model:open="modalOpen" title="Example modal" description="A generic overlay.">
            <p class="text-sm text-muted">Any content goes here.</p>
            <template #footer>
                <Button variant="outline" @click="modalOpen = false">Cancel</Button>
                <Button variant="primary" @click="modalOpen = false">Save</Button>
            </template>
        </Modal>

        <Sheet v-model:open="sheetOpen" title="Example sheet" description="Edge drawer." side="end">
            <p class="text-sm text-muted">Slides from the inline-end edge (RTL-aware).</p>
        </Sheet>

        <ConfirmDialog v-model:open="confirmOpen" tone="danger" title="Delete this?" body="This cannot be undone." @confirm="confirmOpen = false" />
    </div>
</template>

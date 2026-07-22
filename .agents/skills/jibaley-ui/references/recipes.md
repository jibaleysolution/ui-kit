# @jibaleysolution/ui — composition recipes

## Index page (list + search + sort + row actions + delete + pagination)

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { router } from '@inertiajs/vue3';
import {
    Card, FilterBar, SearchInput, DataTable, SortableHeader, StatusBadge,
    RowActions, ConfirmDialog, Pagination, EmptyState, useDataTable, toneFor,
} from '@jibaleysolution/ui';
import { orderStatusTone } from '@/lib/badges';

const props = defineProps<{ orders: Paginated<Order>; filters: { search: string; sort: string; dir: 'asc'|'desc' } }>();
const { filters, onSearch, sortBy } = useDataTable(props.filters);

const deleting = ref<Order | null>(null);
function destroy() {
    router.delete(route('admin.orders.destroy', deleting.value!.id), { onFinish: () => (deleting.value = null) });
}
</script>

<template>
    <FilterBar>
        <SearchInput v-model="filters.search" @search="onSearch" />
    </FilterBar>

    <DataTable>
        <template #head>
            <th class="px-4 py-3"><SortableHeader label="Customer" column="customer" :active="filters.sort" :dir="filters.dir" @sort="sortBy" /></th>
            <th class="px-4 py-3">Status</th>
            <th class="px-4 py-3" />
        </template>
        <template #body>
            <tr v-for="order in orders.data" :key="order.id">
                <td class="px-4 py-3">{{ order.customer }}</td>
                <td class="px-4 py-3"><StatusBadge :label="order.status" :tone="toneFor(orderStatusTone, order.status)" /></td>
                <td class="px-4 py-3">
                    <RowActions :edit-href="route('admin.orders.edit', order.id)" deletable @delete="deleting = order" />
                </td>
            </tr>
        </template>
        <template #footer>
            <EmptyState v-if="!orders.data.length" title="No orders yet" />
            <div class="p-4"><Pagination :meta="orders.meta" /></div>
        </template>
    </DataTable>

    <ConfirmDialog
        :open="deleting !== null"
        tone="danger"
        title="Delete order?"
        @update:open="(v) => !v && (deleting = null)"
        @confirm="destroy"
    />
</template>
```

## Form page (create/edit)

```vue
<script setup lang="ts">
import { useForm } from '@inertiajs/vue3';
import { FormShell, Card, Label, Input, Select, Textarea, Toggle, Button, FieldError } from '@jibaleysolution/ui';

const form = useForm({ name: '', category: '', notes: '', active: true });
function submit() { form.post(route('admin.items.store')); }
</script>

<template>
    <FormShell title="New item" description="Basic details" :back-href="route('admin.items.index')">
        <Card>
            <form class="space-y-5" @submit.prevent="submit">
                <div>
                    <Label for="name">Name</Label>
                    <Input id="name" v-model="form.name" :invalid="!!form.errors.name" />
                    <FieldError :message="form.errors.name" />
                </div>
                <div>
                    <Label for="notes">Notes</Label>
                    <Textarea id="notes" v-model="form.notes" :invalid="!!form.errors.notes" />
                    <FieldError :message="form.errors.notes" />
                </div>
                <Toggle v-model="form.active" />
                <Button type="submit" variant="primary" :loading="form.processing">Save</Button>
            </form>
        </Card>
    </FormShell>
</template>
```

## Modal for a non-destructive action

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { Modal, Label, Input, Button } from '@jibaleysolution/ui';

const open = ref(false);
</script>

<template>
    <Button @click="open = true">Add note</Button>

    <Modal v-model:open="open" title="Add note" size="sm">
        <Label for="note">Note</Label>
        <Input id="note" v-model="note" />
        <template #footer>
            <Button variant="outline" @click="open = false">Cancel</Button>
            <Button variant="primary" @click="save">Save</Button>
        </template>
    </Modal>
</template>
```

## Toast wiring (once, in your root layout)

```vue
<script setup lang="ts">
import { Toaster } from '@jibaleysolution/ui';
</script>
<template>
    <Toaster />
    <!-- rest of layout -->
</template>
```

Server side, flash a toast shaped `{ type: 'success'|'error'|'info', message: string }` under the `toast` flash key — e.g. in Laravel: `session()->flash('toast', ['type' => 'success', 'message' => '...'])`, surfaced to Inertia as `page.props.flash.toast`.

## Decision: Modal vs. ConfirmDialog vs. raw Dialog primitives

- **Deleting/destructive/simple yes-no** → `ConfirmDialog` (built-in Cancel/Confirm, `tone="danger"`).
- **Anything else in an overlay** (a small form, a detail view, multi-step content) → `Modal` (bring your own footer buttons via `#footer`).
- **Neither fits** (custom animation, non-standard layout) → compose the raw `DialogRoot`/`DialogContent`/etc. primitives re-exported from `@jibaleysolution/ui`.

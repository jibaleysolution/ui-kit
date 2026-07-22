// Components
export { default as Button } from './components/Button.vue';
export { default as Card } from './components/Card.vue';
export { default as CodeChip } from './components/CodeChip.vue';
export { default as ColorField } from './components/ColorField.vue';
export { default as ConfirmDialog } from './components/ConfirmDialog.vue';
export { default as DataTable } from './components/DataTable.vue';
export { default as DescriptionList } from './components/DescriptionList.vue';
export { default as EmptyState } from './components/EmptyState.vue';
export { default as FieldError } from './components/FieldError.vue';
export { default as FileUpload } from './components/FileUpload.vue';
export { default as FilterBar } from './components/FilterBar.vue';
export { default as FormShell } from './components/FormShell.vue';
export { default as Input } from './components/Input.vue';
export { default as KeyValue } from './components/KeyValue.vue';
export { default as Label } from './components/Label.vue';
export { default as Modal } from './components/Modal.vue';
export { default as PageHeader } from './components/PageHeader.vue';
export { default as Pagination } from './components/Pagination.vue';
export { default as Repeater } from './components/Repeater.vue';
export { default as RowActions } from './components/RowActions.vue';
export { default as SearchInput } from './components/SearchInput.vue';
export { default as SegmentedControl } from './components/SegmentedControl.vue';
export { default as Select } from './components/Select.vue';
export { default as Skeleton } from './components/Skeleton.vue';
export { default as SortableHeader } from './components/SortableHeader.vue';
export { default as StatCard } from './components/StatCard.vue';
export { default as StatusBadge } from './components/StatusBadge.vue';
export { default as TagsInput } from './components/TagsInput.vue';
export { default as Textarea } from './components/Textarea.vue';
export { default as Toaster } from './components/Toaster.vue';
export { default as Toggle } from './components/Toggle.vue';

// Composables
export { useToast } from './composables/useToast';
export type { Toast } from './composables/useToast';
export { useTrans } from './composables/useTrans';
export { useClipboard } from './composables/useClipboard';
export { useDebounceFn } from './composables/useDebounceFn';
export { useDataTable } from './composables/useDataTable';
export type { DataTableFilters } from './composables/useDataTable';

// Lib
export { toneFor } from './lib/tone';
export type { Tone, Paginated, PaginatedMeta, PaginationLink, FlashToast, ToastType } from './lib/types';

// reka-ui Dialog primitives — escape hatch for bespoke modals that don't fit
// ConfirmDialog or Modal.
export {
    DialogRoot,
    DialogTrigger,
    DialogPortal,
    DialogOverlay,
    DialogContent,
    DialogTitle,
    DialogDescription,
    DialogClose,
} from 'reka-ui';

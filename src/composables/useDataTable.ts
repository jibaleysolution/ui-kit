import { reactive } from 'vue';
import { router } from '@inertiajs/vue3';

export interface DataTableFilters {
    search?: string;
    sort?: string;
    dir?: 'asc' | 'desc';
}

/**
 * Server-driven search/sort/pagination for admin index pages. Reloads the
 * current Inertia page with query params (no Ziggy needed — it reuses the
 * current pathname). Controllers whitelist the accepted sort columns.
 */
export function useDataTable(initialFilters: DataTableFilters = {}) {
    const filters = reactive({
        search: initialFilters.search ?? '',
        sort: initialFilters.sort ?? '',
        dir: initialFilters.dir ?? 'desc',
    });

    let debounceTimer: ReturnType<typeof setTimeout> | undefined;

    const reload = () => {
        router.get(
            window.location.pathname,
            {
                search: filters.search || undefined,
                sort: filters.sort || undefined,
                dir: filters.dir || undefined,
            },
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    const onSearch = (value: string) => {
        filters.search = value;
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(reload, 300);
    };

    const sortBy = (column: string) => {
        if (filters.sort === column) {
            filters.dir = filters.dir === 'asc' ? 'desc' : 'asc';
        } else {
            filters.sort = column;
            filters.dir = 'asc';
        }
        reload();
    };

    return { filters, onSearch, sortBy, reload };
}

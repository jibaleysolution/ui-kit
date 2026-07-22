export type Tone = 'green' | 'red' | 'amber' | 'sky' | 'teal' | 'neutral';

export type ToastType = 'success' | 'error' | 'info';

export interface FlashToast {
    type: ToastType;
    message: string;
}

export interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

export interface PaginatedMeta {
    current_page: number;
    from: number | null;
    to: number | null;
    last_page: number;
    per_page: number;
    total: number;
    links: PaginationLink[];
}

export interface Paginated<T> {
    data: T[];
    links: {
        first: string | null;
        last: string | null;
        prev: string | null;
        next: string | null;
    };
    meta: PaginatedMeta;
}

export type TSearchQueryParams<T> = {
    sortBy?: T;
    sortDirection?: 'asc' | 'desc';
    pageNumber?: string;
    pageSize?: string;
};

export type TMappedSearchQueryParams<T> = {
    sortBy: T;
    sortDirection: 1 | -1;
    pageNumber: number;
    pageSize: number;
};

export type TIDParam = {
    id: string;
}

export type AllItemsViewModel<T> = {
    pagesCount: number;
    page: number;
    pageSize: number;
    totalCount: number;
    items: T[];
};

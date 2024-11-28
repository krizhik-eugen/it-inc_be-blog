export type TSearchQueryParams = {
    sortBy?: 'createdAt' | 'name'
    sortDirection?: 'asc' | 'desc'
    pageNumber?: string
    pageSize?: string
}

export type TDBSearchParams = {
    sortBy?: 'createdAt' | 'name',
    sortDirection?: 1 | -1,
    pageNumber?: number,
    pageSize?: number,
}
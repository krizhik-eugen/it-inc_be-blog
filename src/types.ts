export type TSearchQueryParams = {
    sortBy: 'createdAt' | 'name'
    sortDirection: 'asc' | 'desc' | 1 | -1
    pageNumber: number
    pageSize: number
}
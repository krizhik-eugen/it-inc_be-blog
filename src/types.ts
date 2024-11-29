export type TSearchQueryParams = {
    sortBy?: 'createdAt' | 'name';
    sortDirection?: 'asc' | 'desc';
    pageNumber?: string;
    pageSize?: string;
};

export type TMappedSearchQueryParams = {
    sortBy: 'createdAt' | 'name';
    sortDirection: 1 | -1;
    pageNumber: number;
    pageSize: number;
};

export type TDBSearchParams = {
    blogId?: string;
    findName?: string;
    sortBy: 'createdAt' | 'name';
    sortDirection: 1 | -1;
    skip: number;
    limit: number;
};

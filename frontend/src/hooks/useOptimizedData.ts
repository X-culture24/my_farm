import { useState, useEffect, useMemo, useCallback } from 'react';
import { globalCache, createDebouncedSearch } from '../utils/performance';

interface UseOptimizedDataOptions<T> {
  data: T[];
  searchFields: (keyof T)[];
  filterFn?: (item: T, filters: Record<string, any>) => boolean;
  sortFn?: (a: T, b: T, orderBy: keyof T, order: 'asc' | 'desc') => number;
  cacheKey?: string;
  cacheTTL?: number;
}

export const useOptimizedData = <T extends Record<string, any>>({
  data,
  searchFields,
  filterFn,
  sortFn,
  cacheKey,
  cacheTTL = 300000, // 5 minutes
}: UseOptimizedDataOptions<T>) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [orderBy, setOrderBy] = useState<keyof T>('createdAt');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Debounced search
  const debouncedSetSearchTerm = useMemo(
    () => createDebouncedSearch(setSearchTerm),
    []
  );

  // Optimized filtering and sorting
  const processedData = useMemo(() => {
    const cacheKeyForData = cacheKey ? `${cacheKey}_${JSON.stringify({ searchTerm, filters, orderBy, order })}` : null;
    
    if (cacheKeyForData) {
      const cached = globalCache.get(cacheKeyForData);
      if (cached) return cached;
    }

    let filtered = [...data];

    // Apply search
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(item =>
        searchFields.some(field => {
          const value = item[field];
          return value && value.toString().toLowerCase().includes(searchLower);
        })
      );
    }

    // Apply filters
    if (filterFn) {
      filtered = filtered.filter(item => filterFn(item, filters));
    }

    // Apply sorting
    if (sortFn) {
      filtered.sort((a, b) => sortFn(a, b, orderBy, order));
    } else {
      filtered.sort((a, b) => {
        const aValue = a[orderBy] || '';
        const bValue = b[orderBy] || '';
        
        if (order === 'asc') {
          return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        } else {
          return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
        }
      });
    }

    if (cacheKeyForData) {
      globalCache.set(cacheKeyForData, filtered, cacheTTL);
    }

    return filtered;
  }, [data, searchTerm, filters, orderBy, order, searchFields, filterFn, sortFn, cacheKey, cacheTTL]);

  // Paginated data
  const paginatedData = useMemo(() => {
    const startIndex = page * rowsPerPage;
    return processedData.slice(startIndex, startIndex + rowsPerPage);
  }, [processedData, page, rowsPerPage]);

  // Handlers
  const handleSearch = useCallback((term: string) => {
    debouncedSetSearchTerm(term);
    setPage(0); // Reset to first page on search
  }, [debouncedSetSearchTerm]);

  const handleFilterChange = useCallback((newFilters: Record<string, any>) => {
    setFilters(newFilters);
    setPage(0); // Reset to first page on filter change
  }, []);

  const handleSort = useCallback((field: keyof T) => {
    const isAsc = orderBy === field && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(field);
  }, [orderBy, order]);

  const handlePageChange = useCallback((event: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const handleRowsPerPageChange = useCallback((event: React.ChangeEvent<{ value: unknown }>) => {
    setRowsPerPage(parseInt(event.target.value as string, 10));
    setPage(0);
  }, []);

  return {
    // Data
    filteredData: processedData,
    paginatedData,
    
    // State
    searchTerm,
    filters,
    orderBy,
    order,
    page,
    rowsPerPage,
    
    // Handlers
    handleSearch,
    handleFilterChange,
    handleSort,
    handlePageChange,
    handleRowsPerPageChange,
    
    // Direct setters for advanced use cases
    setSearchTerm,
    setFilters,
    setOrderBy,
    setOrder,
    setPage,
    setRowsPerPage,
  };
};

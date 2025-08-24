// Performance optimization utilities
import React from 'react';

// Simple debounce implementation to avoid lodash dependency
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// Debounced search function
export const createDebouncedSearch = (searchFunction: (term: string) => void, delay: number = 300) => {
  return debounce(searchFunction, delay);
};

// Lazy loading utility for components
export const lazyLoad = (importFunc: () => Promise<any>) => {
  return React.lazy(importFunc);
};

// Memory optimization for large lists
export const virtualizeList = (items: any[], itemHeight: number, containerHeight: number) => {
  const visibleCount = Math.ceil(containerHeight / itemHeight);
  const bufferSize = Math.min(5, Math.floor(visibleCount * 0.5));
  
  return {
    visibleCount: visibleCount + bufferSize * 2,
    startIndex: 0,
    endIndex: visibleCount + bufferSize * 2
  };
};

// Image optimization
export const optimizeImageUrl = (url: string, width?: number, height?: number, quality: number = 80) => {
  if (!url) return '';
  
  // For production, you would integrate with a service like Cloudinary or ImageKit
  const params = new URLSearchParams();
  if (width) params.append('w', width.toString());
  if (height) params.append('h', height.toString());
  params.append('q', quality.toString());
  
  return `${url}?${params.toString()}`;
};

// Cache management
export class SimpleCache {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

  set(key: string, data: any, ttl: number = 300000) { // 5 minutes default
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  get(key: string) {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  clear() {
    this.cache.clear();
  }

  size() {
    return this.cache.size;
  }
}

// Global cache instance
export const globalCache = new SimpleCache();

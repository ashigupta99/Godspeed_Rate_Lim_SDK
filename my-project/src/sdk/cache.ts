type CacheItem<T> = {
  value: T;
  expiry: number;
};

const cache: Record<string, CacheItem<any>> = {};

export function setCache<T>(key: string, value: T, ttlMs: number): void {
  cache[key] = {
    value,
    expiry: Date.now() + ttlMs
  };
}

export function getCache<T>(key: string): T | null {
  const item = cache[key];
  if (!item) return null;
  if (Date.now() > item.expiry) {
    delete cache[key];
    return null;
  }
  return item.value;
}

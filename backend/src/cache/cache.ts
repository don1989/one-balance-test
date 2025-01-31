const CACHE_EXPIRY = 60 * 1000;

export class Cache<Key, Value> {
  private cache: Map<Key, { value: Value; timestamp: number }>;

  constructor() {
    this.cache = new Map<Key, { value: Value; timestamp: number }>();
  }

  public store(key: Key, value: Value) {
    if (!value) {
      // clear from cache
      this.cache.delete(key);
    } else {
      this.cache.set(key, {
        value,
        timestamp: Date.now(),
      });
    }
  }

  public retrieve(key: Key): Value | undefined {
    if (!this.cache.has(key)) {
      return undefined;
    }

    const value = this.cache.get(key);
    if (!value) {
      return undefined;
    }

    if (Date.now() < value.timestamp + CACHE_EXPIRY) {
      return value.value;
    } else {
      this.cache.delete(key);
    }

    // expired, return undefined
    return undefined;
  }
}

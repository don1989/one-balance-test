import { Cache } from "./cache";

describe("Cache", () => {
  let cache: Cache<string, number>;

  beforeEach(() => {
    cache = new Cache<string, number>();
    jest.useFakeTimers();
  });

  it("should store and retrieve a value", () => {
    cache.store("key1", 42);
    expect(cache.retrieve("key1")).toBe(42);
  });

  it("should return undefined for missing key", () => {
    const retVal = cache.retrieve("missing key");
    expect(retVal).toBeUndefined();
  });

  it("should delete key if given undefined value", () => {
    cache.store("key1", 42);
    cache.store("key1", undefined as any);
    expect(cache.retrieve("key1")).toBeUndefined();
  });

  it("should expire keys after CACHE_EXPIRY", () => {
    cache.store("key1", 42);
    jest.advanceTimersByTime(60 * 1000 + 1);
    expect(cache.retrieve("key1")).toBeUndefined();
  });

  it("should NOT expire keys after CACHE_EXPIRY", () => {
    cache.store("key1", 42);
    jest.advanceTimersByTime(59 * 1000);
    expect(cache.retrieve("key1")).toBe(42);
  });
});

export default class<T> {
  cache: { [key: string]: T } = {};
  keygen: (o: T) => string;

  constructor(keygen: (o: T) => string) {
    this.keygen = keygen;
  }

  async fetch(key: string, force: boolean, f: () => Promise<T>) {
    if (!force) {
      const c = this.cache[key] || undefined;
      if (c) return c;
    }
    const value = await f();
    this.cache[this.keygen(value)] = value;
    return value;
  }
}

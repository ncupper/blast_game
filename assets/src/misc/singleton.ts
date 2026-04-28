export default class SingletonFactory<T> {
  private instance: T | null = null;

  constructor(private createInstance: () => T) {}

  getInstance(): T {
    if (!this.instance) {
      this.instance = this.createInstance();
    }
    return this.instance;
  }
}
export default class Queue<T> {
    private _storage: Record<number, T> = {};
    private _head = 0;
    private _tail = 0;

    enqueue(item: T): void {
        this._storage[this._tail] = item;
        this._tail++;
    }

    dequeue(): T | null {
        if (this.size === 0)
             return null;
        const item = this._storage[this._head];
        delete this._storage[this._head];
        this._head++;
        return item;
    }

    peek(): T | null {
        if (this.size === 0)
             return null;
        return this._storage[this._head];
    }

    get size(): number {
        return this._tail - this._head;
    }
    
    public clear(): void {
        this._storage = {};
        this._head = 0;
        this._tail = 0;
    }
}
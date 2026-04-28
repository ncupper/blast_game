import SingletonFactory from "../../misc/singleton";

export interface ISystemsLocator {
    get<T>(key: string): T | null;
    add(key: string, system: any): void;
}

const locatorFactory = new SingletonFactory<ISystemsLocator>(() => new SystemsLocator());

export default function getSystemLocator() : ISystemsLocator {
    return locatorFactory.getInstance();
}

export class SystemsLocator implements ISystemsLocator {
    private _systems: Map<string, any> = new Map();

    public get<T>(key: string): T | null {
        if (this._systems.has(key)) {
            return this._systems.get(key) as T;
        }
        console.warn(`System not found: ${key}`);
        return null;
    }

    public add(key: string, system: any) {
        this._systems.set(key, system);
    }
}
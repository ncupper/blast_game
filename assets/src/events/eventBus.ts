import { GameEvents } from './gameEvents';
import * as EventData  from './eventData';
import SingletonFactory from '../misc/singleton';

type EventDataMap = {
    [GameEvents.TileSpawn]: EventData.TileSpawnData;
    [GameEvents.TileMove]: EventData.TileMoveData;
    [GameEvents.TileCollect]: EventData.TileCollectData;
    [GameEvents.Reshuffle]: EventData.ReshuffleData;
    [GameEvents.ScoresChanged]: EventData.ScoresChangedData;
    [GameEvents.MovesChanged]: EventData.MovesChangedData;
    [GameEvents.GameOver]: EventData.GameOverData;
};

export interface IEventBus {
    on<T extends GameEvents>(event: T, callback: (data: EventDataMap[T]) => void, target: any): void;
    emit<T extends GameEvents>(event: T, data?: EventDataMap[T]): void;
    off<T extends GameEvents>(event: T, callback: (data: EventDataMap[T]) => void, target: any): void;
}

const eventBusFactory = new SingletonFactory<IEventBus>(() => new EventBus());

export default function getEventBus() : IEventBus {
    return eventBusFactory.getInstance();
}

export class EventBus implements IEventBus {
    private events: Map<GameEvents, Array<{
        callback: Function;
        target: any;}>> = new Map();

    public on<T extends GameEvents>(event: T, callback: (data: EventDataMap[T]) => void, target: any) {
        if (!this.events.has(event)) {
            this.events.set(event, []);
        }
        this.events.get(event)!.push({ callback, target });
    }

    public emit<T extends GameEvents>(event: T, data?: EventDataMap[T]) {
        if (CC_DEBUG) {
            console.log(`[EventBus] Emitting: ${event}`, data);
        }
        const handlers = this.events.get(event);
        if (handlers) {
            handlers.forEach(handler => {
            handler.callback.call(handler.target, data);
            });
        }
    }

    public off<T extends GameEvents>(event: T, callback: (data: EventDataMap[T]) => void, target: any) {
        const handlers = this.events.get(event);
        if (handlers) {
            const index = handlers.findIndex(h => h.callback === callback && h.target === target);
            if (index !== -1) {
                handlers.splice(index, 1);
            }
        }
    }
}

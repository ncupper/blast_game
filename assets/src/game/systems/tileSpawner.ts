import getEventBus from "../../events/eventBus";
import { GameEvents } from "../../events/gameEvents";
import { IFieldCell } from "../field/cell";
import { Tile } from "../field/tile";

export interface ITileSpawner {
    spawn(cell: IFieldCell, types: number[]): void;
}

export class TileSpawner implements ITileSpawner {

    public spawn(cell: IFieldCell, types: number[]) {
        const rnd = Math.trunc(Math.random() * types.length);
        const spawnType = types[rnd];
        const tile = new Tile(cell.position, spawnType);
        cell.tile = tile;
        getEventBus().emit(GameEvents.TileSpawn, {cell: cell, tile: tile});
    }
}
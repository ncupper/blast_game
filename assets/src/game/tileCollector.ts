import getEventBus, { IEventBus } from "../events/eventBus";
import { GameEvents } from "../events/gameEvents";
import { IFieldCell, NeighbourDir } from "./field/cell";
import { TileType } from "./field/tile";

export interface ITileCollector {
    collect(cell: IFieldCell, collectCallback: (tileType: number)=> void): void;
}

export class TileCollector implements ITileCollector {
    private _rules: Map<number, (cell: IFieldCell, collectCallback: (tileType: number)=> void) => void> = new Map();
    private _defaultRule: (cell: IFieldCell, collectCallback: (tileType: number)=> void) => void;
    private _eventBus: IEventBus;

    constructor() {
        this._eventBus = getEventBus();
        
        this._defaultRule = this.defaultCollect;
        
        this._rules.set(TileType.Bomb, this.bombCollect.bind(this));
        this._rules.set(TileType.BigBomb, this.bigBombCollect.bind(this));
        this._rules.set(TileType.HRocket, this.horizontalRocketCollect.bind(this));
        this._rules.set(TileType.VRocket, this.verticalRocketCollect.bind(this));
    }
    
    public collect(cell: IFieldCell, collectCallback: (tileType: number)=> void) {
        if (cell.isEmpty)
            return;
        if (this._rules.has(cell.tile!.type)) {
            this._rules.get(cell.tile!.type)!(cell, collectCallback);
        }
        else {
            this._defaultRule(cell, collectCallback);
        }
    }

    private doCollect(cell: IFieldCell, collectCallback: (tileType: number)=> void) {
        this._eventBus.emit(GameEvents.TileCollect, { cell: cell, tile: cell.tile! });
        collectCallback(cell.tile!.type);
        cell.tile = null;
    }

    private defaultCollect(cell: IFieldCell, collectCallback: (tileType: number)=> void) {
        this.doCollect(cell, collectCallback);
    }

    private bigBombCollect(cell: IFieldCell, collectCallback: (tileType: number)=> void) {
        this.doCollect(cell, collectCallback);
        this.collectFromToDir(cell, NeighbourDir.Left, collectCallback, 2);
        this.collectFromToDir(cell, NeighbourDir.Right, collectCallback, 2);

        let neighbour = cell.getNeighbour(NeighbourDir.Up);
        this.collectFromToDir(neighbour, NeighbourDir.Left, collectCallback, 2);
        this.collectFromToDir(neighbour, NeighbourDir.Right, collectCallback, 2);
        neighbour = neighbour?.getNeighbour(NeighbourDir.Up);
        this.collectFromToDir(neighbour, NeighbourDir.Left, collectCallback, 2);
        this.collectFromToDir(neighbour, NeighbourDir.Right, collectCallback, 2);
        
        neighbour = cell.getNeighbour(NeighbourDir.Down);
        this.collectFromToDir(neighbour, NeighbourDir.Left, collectCallback, 2);
        this.collectFromToDir(neighbour, NeighbourDir.Right, collectCallback, 2);
        neighbour = neighbour?.getNeighbour(NeighbourDir.Down);
        this.collectFromToDir(neighbour, NeighbourDir.Left, collectCallback, 2);
        this.collectFromToDir(neighbour, NeighbourDir.Right, collectCallback, 2);
    }

    private bombCollect(cell: IFieldCell, collectCallback: (tileType: number)=> void) {
        this.doCollect(cell, collectCallback);
        this.collectFromToDir(cell, NeighbourDir.Left, collectCallback, 1);
        this.collectFromToDir(cell, NeighbourDir.Right, collectCallback, 1);

        let neighbour = cell.getNeighbour(NeighbourDir.Up);
        this.collectFromToDir(neighbour, NeighbourDir.Left, collectCallback, 1);
        this.collectFromToDir(neighbour, NeighbourDir.Right, collectCallback, 1);
        
        neighbour = cell.getNeighbour(NeighbourDir.Down);
        this.collectFromToDir(neighbour, NeighbourDir.Left, collectCallback, 1);
        this.collectFromToDir(neighbour, NeighbourDir.Right, collectCallback, 1);
    }

    private horizontalRocketCollect(cell: IFieldCell, collectCallback: (tileType: number)=> void) {
        this.doCollect(cell, collectCallback);
        
        let neighbour = cell.getNeighbour(NeighbourDir.Left);
        this.collectFromToDir(neighbour, NeighbourDir.Left, collectCallback, -1);
        
        neighbour = cell.getNeighbour(NeighbourDir.Right);
        this.collectFromToDir(neighbour, NeighbourDir.Right, collectCallback, -1);
    }

    private verticalRocketCollect(cell: IFieldCell, collectCallback: (tileType: number)=> void) {
        this.doCollect(cell, collectCallback);
        
        let neighbour = cell.getNeighbour(NeighbourDir.Up);
        this.collectFromToDir(neighbour, NeighbourDir.Up, collectCallback, -1);
        
        neighbour = cell.getNeighbour(NeighbourDir.Down);
        this.collectFromToDir(neighbour, NeighbourDir.Down, collectCallback, -1);
    }

    private collectFromToDir(from: IFieldCell, dir: number, collectCallback: (tileType: number)=> void, count: number) {
        while (from) {
            this.collect(from, collectCallback);
            if (count === 0)
                break;
            from = from.getNeighbour(dir);
            --count;
        }

    }
}
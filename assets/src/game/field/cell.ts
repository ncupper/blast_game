import { CellPosition } from "./cellPosition";
import { ITile } from "./tile";

export const enum NeighbourDir {
    Up = 0,
    Down = 1,
    Left = 2,
    Right = 3,

    Last
};

export interface IFieldCell {
    isEmpty: boolean;
    tile: ITile | null;
    position: CellPosition;
    getNeighbour(dir : NeighbourDir) : IFieldCell;
    linkNeighbour(dir: NeighbourDir, cell: IFieldCell): void;
}

export class FieldCell implements IFieldCell {
    private _position: CellPosition;
    private _neighbours : IFieldCell[] = [];
    private _tile: ITile | null;

    constructor (col: number, row: number) {
        this._position = new CellPosition(col, row);
        this._neighbours = new Array(NeighbourDir.Last).fill(null);
        this._tile = null;
    }
    
    public getNeighbour(dir : NeighbourDir) : IFieldCell
    {
        return this._neighbours[dir];
    }

    public linkNeighbour(dir: NeighbourDir, cell: IFieldCell) {
        this._neighbours[dir] = cell;
        const reverseDir = dir%2 === 0
            ? dir + 1
            : dir - 1;
        (cell as FieldCell)._neighbours[reverseDir] = this;
    }

    public get isEmpty(): boolean {
        return this._tile == null;
    }

    public get tile(): ITile | null {
        return this._tile;
    }

    public set tile(tile: ITile | null) {
        this._tile = tile;
    }

    public get position(): CellPosition {
        return this._position;
    }

    public getPosition(): CellPosition
    {
        return this._position;
    }
}
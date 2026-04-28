import { CellPosition } from "./cellPosition";

export const TileType = cc.Enum({
    None: 0,
    Blue: 1,
    Purple: 2,
    Yellow: 3,
    Green: 4,
    Red: 5,
    Bomb: 6,
    VRocket: 7,
    HRocket: 8,
    BigBomb: 9
});

export interface ITile {
    type: number;
    position: CellPosition;
}

export class Tile implements ITile {
    private _position: CellPosition;
    private _type: number = TileType.None;

    constructor(position: CellPosition, type: number) {
        this._position = position;
        this._type = type;
    }

    public get type(): number {
        return this._type;
    }
    
    public get position(): CellPosition {
        return this._position;
    }

    public set position(position: CellPosition) {
        this._position = position;
    }
}
import { IFieldCell } from "../game/field/cell";
import { ITile } from "../game/field/tile";

export interface TileSpawnData {
    cell: IFieldCell;
    tile: ITile;
}

export interface TileMoveData {
    from: IFieldCell;
    to: IFieldCell;
    tile: ITile;
}

export interface TileCollectData {
    cell: IFieldCell;
    tile: ITile;
}

export interface ReshuffleData {}

export interface ScoresChangedData {
    value: number;
}

export interface MovesChangedData {
    value: number;
}

export interface GameOverData {
    isWin: boolean;
}
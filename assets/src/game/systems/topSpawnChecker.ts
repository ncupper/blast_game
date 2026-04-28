import { NeighbourDir } from "../field/cell";
import IField from "../field/field";
import { TileType } from "../field/tile";
import { ITileSpawner } from "./tileSpawner";

export interface ITopSpawnChecker {
    apply(field: IField, spawner: ITileSpawner | null): void;
}

export class TopSpawnChecker implements ITopSpawnChecker {
    public apply(field: IField, spawner: ITileSpawner | null) {
        const tileTypes = [TileType.Blue, TileType.Yellow, TileType.Red, TileType.Green, TileType.Purple];
        let cell = field.getFirstCell();
        while (cell) {
            if (cell.isEmpty) {
                spawner?.spawn(cell, tileTypes);
            }
            cell = cell.getNeighbour(NeighbourDir.Right);
        }
    }
}
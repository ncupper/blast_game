import getEventBus from "../../events/eventBus";
import { GameEvents } from "../../events/gameEvents";
import { IFieldCell, NeighbourDir } from "../field/cell";
import IField from "../field/field";

export interface IGravitySystem {
    apply(field: IField): void;
}

export class GravitySystem implements IGravitySystem {
    public apply(field: IField) {
        let cell = field.getLastCell().getNeighbour(NeighbourDir.Up);
        while (cell) {
            let neighbour = cell;
            while (neighbour) {
                const tile = neighbour.tile;
                if (!neighbour.isEmpty && this.canDrop(neighbour)) {
                    this.dropDown(neighbour);
                }
                neighbour = neighbour.getNeighbour(NeighbourDir.Left);
            }
            cell = cell.getNeighbour(NeighbourDir.Up);
        }
    }

    private canDrop(cell: IFieldCell): boolean {
        return cell.getNeighbour(NeighbourDir.Down)?.isEmpty;
    }

    private dropDown(cell: IFieldCell) {
        let target = cell;
        while (this.canDrop(target)) {
            target = target.getNeighbour(NeighbourDir.Down);
        }
        const tile = cell.tile;
        cell.tile = null;
        target.tile = tile;

        if (tile) {
            tile.position = target.position;
            getEventBus().emit(GameEvents.TileMove, { from: cell, to: target, tile: tile });
        }
    }
}
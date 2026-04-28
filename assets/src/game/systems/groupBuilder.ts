import { IFieldCell, NeighbourDir } from "../field/cell";
import IField from "../field/field";

export default interface IGroupBuilder {
    hasGroup(cell: IFieldCell): void;
    getGroup(from: IFieldCell): IFieldCell[];
    hasAnyGroup(field: IField): boolean;
}

export class GroupBuilder implements IGroupBuilder {
    public hasGroup(cell: IFieldCell) {
        const cellTile = cell.tile;
        if (!cellTile)
            return false;
        
        for (let dir = 0; dir < NeighbourDir.Last; ++dir) {
            let neighbour = cell.getNeighbour(dir);
            if (neighbour && neighbour.tile?.type === cellTile.type)
                return true;
        }

        return false;
    }
    
    public getGroup(from: IFieldCell): IFieldCell[] {
        const chain: IFieldCell[] = [];
        const chainTile = from.tile;
        if (chainTile) {
            chain.push(from);
            this.buildGroup(chainTile.type, from, chain);
        }
        return chain;
    }

    private buildGroup(groupTileType: number, cell: IFieldCell, chain: IFieldCell[]) {
        for (let dir = 0; dir < NeighbourDir.Last; ++dir) {
            let neighbour = cell.getNeighbour(dir);
            if (neighbour && neighbour.tile?.type === groupTileType && !chain.includes(neighbour)) {
                chain.push(neighbour);
                this.buildGroup(groupTileType, neighbour, chain);
            }
        }
    }

    public hasAnyGroup(field: IField): boolean {
        let cell = field.getFirstCell();
        while (cell) {
            let neighbour = cell;
            while (neighbour) {
                if (this.hasGroup(neighbour)) {
                    return true;
                }
                neighbour = neighbour.getNeighbour(NeighbourDir.Right);
            }
            cell = cell.getNeighbour(NeighbourDir.Down);
        }
        return false;
    }
}

import { FieldCell, IFieldCell, NeighbourDir } from "./cell";

export default interface IField {
    setup(width: number, height: number): void;
    clear(): void;
    getFirstCell() : IFieldCell;
    getLastCell() : IFieldCell;
    getCell(col: number, row: number) : IFieldCell;
    hasEmptyCells() : boolean;
}

export class Field implements IField {
    private _cells: IFieldCell[] = [];
    private _width: number = 0;

    private _nullCell: IFieldCell;

    constructor() {
        this._nullCell = new FieldCell(-1, -1);
    }

    public setup(width: number, height: number)
    {
        this._width = width;
        this._cells = new Array(width * height);
        this.createCells();
    }

    public clear(): void {
        for (const cell of this._cells) {
            cell.tile = null;
        }
    }

    private createCells() {
        for (let i: number = 0; i < this._cells.length; ++i) {
            const row = Math.trunc(i / this._width);
            const col = i % this._width;
            this._cells[i] = new FieldCell(col, row);
            if (row > 0)
                this._cells[i].linkNeighbour(NeighbourDir.Up, this._cells[i - this._width]);
            if (col > 0)
               this._cells[i].linkNeighbour(NeighbourDir.Left, this._cells[i - 1]);
        }
    }

    public getFirstCell(): IFieldCell {
        if (this._cells.length > 0)
            return this._cells[0];
        return this._nullCell;
    }

    public getLastCell(): IFieldCell {
        if (this._cells.length > 0)
            return this._cells[this._cells.length - 1];
        return this._nullCell;
    }

    public getCell(col: number, row: number) : IFieldCell {
        const index = row * this._width + col;
        if (index >= 0 && index < this._cells.length)
            return this._cells[index];

        return this._nullCell;
    }

    public hasEmptyCells(): boolean {
        for (const cell of this._cells) {
            if (cell.isEmpty)
                return true;
        }
        return false;
    }
}
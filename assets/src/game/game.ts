import getEventBus from "../events/eventBus";
import { GameEvents } from "../events/gameEvents";
import { Inject } from "../Framework/DI/Atrributes/InjectAttribute";
import { IFieldCell } from "./field/cell";
import IField from "./field/field";
import IGroupBuilder from "./systems/groupBuilder";
import { IGravitySystem } from "./systems/gravitySystem";
import getSystemLocator from "./systems/systemsLocator";
import { ITileSpawner } from "./systems/tileSpawner";
import { ITopSpawnChecker } from "./systems/topSpawnChecker";
import { ITileCollector } from "./tileCollector";

export interface IGameConfig {
    Width: number;
    Height: number;
    BonusTiles: number[];
    Moves: number;
    WinScore: number;
    Shuffles: number;
}

export default interface IGame {
    setup(config: IGameConfig): void;
    restart(): void;
    cellClicked(col: number, row: number): void;
    update(): void;
}

enum GameState {
    None,
    WaitMove,
    GameOver,
}

export class Game implements IGame {
    @Inject("IField")
    private _field: IField = null!;
    @Inject("ITileCollector")
    private _collector: ITileCollector = null!;

    private _tileSpawner: ITileSpawner | null;
    private _groupBuilder: IGroupBuilder | null;
    private _gravity: IGravitySystem | null;
    private _topSpawn: ITopSpawnChecker | null;

    private _config: IGameConfig = null!;
    private _moves: number = 0;
    private _scores: number = 0;
    private _winScore: number = 0;
    private _bonusTiles: number[] = null!;
    private _state: GameState = GameState.None;
    private _reshuffleLeft: number = 0;

    constructor() {
        const locator = getSystemLocator();
        this._tileSpawner = locator.get<ITileSpawner>("ITileSpawner");
        this._groupBuilder = locator.get<IGroupBuilder>("IGroupBuilder");
        this._gravity = locator.get<IGravitySystem>("IGravitySystem");
        this._topSpawn = locator.get<ITopSpawnChecker>("ITopSpawnChecker");
    }
    
    public setup(config: IGameConfig) {
        this._config = config;
        this._field.setup(config.Width, config.Height);
        this._bonusTiles = config.BonusTiles;
        
        this.restart();
    }
    
    public restart() {
        this.reshuffleField();
        
        this._moves = this._config.Moves;
        this._scores = 0;
        this._winScore = this._config.WinScore;
        this._state = GameState.WaitMove;
        this._reshuffleLeft = 3;
        
        getEventBus().emit(GameEvents.MovesChanged, { value: this._moves });
        getEventBus().emit(GameEvents.ScoresChanged, { value: this._scores });
    }

    public update() {
        if (!this._field.hasEmptyCells() && !this._groupBuilder?.hasAnyGroup(this._field)) {
            if (this._reshuffleLeft > 0) {
                this._reshuffleLeft -= 1;
                this.reshuffleField();
            }
            else {
                this.gameOver(false);
            }
            return;
        }
        this._topSpawn?.apply(this._field, this._tileSpawner)
        this._gravity?.apply(this._field);
    }

    public cellClicked(col: number, row: number) {
        if (this._state != GameState.WaitMove)
            return;

        const tapCell = this._field.getCell(col, row);
        if (tapCell.isEmpty || this._moves <= 0) 
            return;

        if (this._bonusTiles.indexOf(tapCell.tile!.type) >= 0) {
            this.doCollectGroup([tapCell]);
        }
        if (this._groupBuilder?.hasGroup(tapCell)) {
            const chain = this._groupBuilder?.getGroup(this._field.getCell(col, row));
            this.doCollectGroup(chain);

            if (chain.length > 3) {
                this._tileSpawner?.spawn(tapCell, this._bonusTiles);
            }
        }
    }

    private gameOver(isWin: boolean) {
        getEventBus().emit(GameEvents.GameOver, { isWin: isWin });
        this._state = GameState.GameOver;
    }

    private doCollectGroup(chain: IFieldCell[]) {
        for (const cell of chain) {
            this._collector.collect(cell, this.onTileCollected.bind(this));
        }

        this._moves -= 1;
        getEventBus().emit(GameEvents.MovesChanged, { value: this._moves });

        if (this._scores >= this._winScore) {
            this.gameOver(true);
        }
        else if (this._moves <= 0) {
            this.gameOver(false);
        }
    }

    private onTileCollected(tileType: number) {
        if (this._bonusTiles.indexOf(tileType) < 0) {
            this._scores += 1;
            getEventBus().emit(GameEvents.ScoresChanged, { value: this._scores });
        }
    }

    private reshuffleField() {
        this._field.clear();
        getEventBus().emit(GameEvents.Reshuffle, {});
    }
}
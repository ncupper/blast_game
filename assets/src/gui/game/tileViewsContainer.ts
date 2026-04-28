import getResolver from "../../DIResolver";
import getEventBus from "../../events/eventBus";
import { TileCollectData, TileMoveData, TileSpawnData } from "../../events/eventData";
import { GameEvents } from "../../events/gameEvents";
import { Inject } from "../../Framework/DI/Atrributes/InjectAttribute";
import { IFieldCell } from "../../game/field/cell";
import { TileView } from "./tileView";
import { ITilesPool } from "./tilesPool";
import Queue from "../../misc/queue";

const {ccclass, property} = cc._decorator;

@ccclass
export default class TileViewsContainer extends cc.Component {
    @property(cc.Size)
    public cellSize: cc.Size = new cc.Size(100, 100);

    @Inject("ITilesPool")
    private _tilesPool: ITilesPool = null!;

    private _views: Map<IFieldCell, TileView> = new Map();
    
    private _wantSpawn: Queue<TileSpawnData> = new Queue();
    private _wantMove: Queue<TileMoveData> = new Queue();
    private _wantCollect: Queue<TileCollectData> = new Queue();

    public onLoad() {
        getResolver().inject(this);

        getEventBus().on(GameEvents.TileSpawn, this.onTileSpawned, this);
        getEventBus().on(GameEvents.TileMove, this.onTileMoved, this);
        getEventBus().on(GameEvents.TileCollect, this.onTileCollected, this);
        getEventBus().on(GameEvents.Reshuffle, this.onReshuffle, this);
    }
    
    private onTileSpawned(data: TileSpawnData) {
        this._wantSpawn.enqueue(data);
    }
    
    private onTileMoved(data: TileMoveData) {
        this._wantMove.enqueue(data);
    }

    private onTileCollected(data: TileCollectData) {
        this._wantCollect.enqueue(data);
    }

    public get isLocked(): boolean { return this._wantSpawn.size > 0 || this._wantMove.size > 0; }

    public update(dt: number) {
        this.processSpawns();
        this.processMoves();
        this.processCollects();
    }

    private processSpawns() {
        if (this._wantSpawn.size === 0)
            return;

        const data = this._wantSpawn.peek();
        if (data && !this._views.has(data.cell)) {
            this.doSpawn();
            this.processSpawns();
        }
    }

    private doSpawn() {
        const data = this._wantSpawn.dequeue()!;
        const view = this._tilesPool.getTile(data.tile.type);
        if (view) {
            view.node.setParent(this.node);
            view.node.active = true;

            view.tile = null;
            const pos = data.cell.position;
            view.node.setPosition(pos.col * this.cellSize.width, -pos.row * this.cellSize.height);
            this._views.set(data.cell, view);
            cc.tween(view.node).delay(0.05).call(() => { view.tile = data.tile; }).start();
        }
    }

    private processMoves() {
        if (this._wantMove.size === 0)
            return;

        const data = this._wantMove.peek();
        if (data && this._views.get(data.from)?.tile === data.tile
            && !this._views.has(data.to)) {
            this.doMove();
            this.processMoves();
        }
    }

    private doMove() {
        const data = this._wantMove.dequeue()!;

        const pos = data.to.position;
        const newPos = cc.v3(pos.col * this.cellSize.width, -pos.row * this.cellSize.height);

        var view = this._views.get(data.from)!;
        const dist = newPos.sub(view.node.position);
        dist.x = Math.round(Math.abs(dist.x) / this.cellSize.width);
        dist.y = Math.round(Math.abs(dist.y) / this.cellSize.height);
        const path = Math.max(Math.max(dist.x, dist.y), 1);
        view.move(newPos, path);

        this._views.delete(data.from);
        this._views.set(data.to, view);
    }

    private processCollects() {
        if (this._wantCollect.size === 0)
            return;

        const data = this._wantCollect.peek();
        if (data && this._views.get(data.cell)?.tile === data.tile) {
            this.doCollect();
            this.processCollects();
        }
    }

    private doCollect() {
        const data = this._wantCollect.dequeue()!;
        const view = this._views.get(data.cell);
        view?.collect(() => {
            this._tilesPool.putTile(view);
            this._views.delete(data.cell);
        });
    }

    private onReshuffle() {
        for (const view of this._views.values()) {
            view?.collect(() => {
                this._tilesPool.putTile(view);
                this._views.clear();
            });
        }
        this._wantSpawn.clear();
        this._wantMove.clear();
        this._wantCollect.clear();
    }
}
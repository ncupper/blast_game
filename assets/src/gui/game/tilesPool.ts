import { GameConfig } from "../../configs/gameConfig";
import { Inject } from "../../Framework/DI/Atrributes/InjectAttribute";
import { TileView } from "./tileView";

export interface ITilesPool {
    getTile(tileType: number): TileView | null;
    putTile(tile: TileView): void;
}

export class TilesPool {
    private _prefabs: Map<number, TileView>;
    private _pools: Map<number, cc.NodePool>;

    @Inject("GameConfig")
    private _config: GameConfig = null!;
    
    constructor() {
        this._prefabs = new Map<number, TileView>();
        this._pools = new Map<number, cc.NodePool>();
    }

    onInjected() {
        for (let t of this._config.TilePrefabs) {
            const instance = this.instantiateTile(t);
            
            this._prefabs.set(instance.tileType, t);
            
            this._pools.set(instance.tileType, new cc.NodePool());
            this._pools.get(instance.tileType)?.put(instance.node);
        }
    }

    private instantiateTile(prefab: TileView): TileView {
        const instance = cc.instantiate(prefab).getComponent(TileView);
        return instance;
    }

    public putTile(tile: TileView) {
        this._pools.get(tile.tileType)?.put(tile.node);
    }

    public getTile(tileType: number): TileView | null {
        const pool = this._pools.get(tileType);
        if (!pool)
            return null;

        if (pool.size() > 0) {
            return pool.get()?.getComponent(TileView);
        }

        const prefab = this._prefabs.get(tileType);
        if (!prefab) 
            return null;

        const instance = this.instantiateTile(prefab);
        return instance;
    }
}
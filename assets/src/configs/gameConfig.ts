import { TileType } from "../game/field/tile";
import { IGameConfig } from "../game/game";
import { TileView } from "../gui/game/tileView";

const { ccclass, property } = cc._decorator;


@ccclass
export class GameConfig extends cc.Component implements IGameConfig {
    @property(cc.Integer)
    public Width: number = 8;
    @property(cc.Integer)
    public Height: number = 8;
    @property(cc.Prefab)
    TilePrefabs: TileView[] = [];
    @property({ type: cc.Enum(TileType) })
    BonusTiles: number[] = [];
    @property(cc.Integer)
    public Moves: number = 8;
    @property(cc.Integer)
    public WinScore: number = 8;
    @property(cc.Integer)
    public Shuffles: number = 8;

    onLoad() {
        cc.game.addPersistRootNode(this.node);
    }
}

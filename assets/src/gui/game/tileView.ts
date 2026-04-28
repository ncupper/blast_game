import { ITile, TileType } from "../../game/field/tile";

const { ccclass, property } = cc._decorator;

export interface ITileView {
    tile: ITile | null;
    move(newPosition: cc.Vec3, dist: number, cbFinish: () => void): void;
    collect(cbFinish: () => void): void;
}

@ccclass
export class TileView extends cc.Component implements ITileView {
    @property(cc.Node)
    public content: cc.Node = null!;
    @property({ type: cc.Enum(TileType) })
    public tileType: number = TileType.None;

    private _tile: ITile | null = null;

    onEnable() {
        this.content.scale = 0;
        this.content.opacity = 0;
        cc.tween(this.content)
            .to(0.1, { scale: 1, opacity: 255 }, { easing: 'quadOut' })
            .start();
    }
    
    public get tile(): ITile | null {
        return this._tile;
    }

    public set tile(value: ITile | null) {
        this._tile = value;
    }

    public move(newPosition: cc.Vec3, dist: number) {
        cc.tween(this.node)
            .to(0.05 * dist , { position: newPosition })
            .start();
    }

    public collect(cbFinish: () => void) {
        cc.tween(this.content)
            .to(0.2, { scale: 0, opacity: 0 })
            .call(() => {
                this.node.active = false;
                cbFinish();
            })
            .start();
    }

    protected update(dt: number): void {
    }
}
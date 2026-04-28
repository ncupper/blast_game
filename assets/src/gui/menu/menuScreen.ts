import { TileType } from "../../game/field/tile";

const { ccclass, property } = cc._decorator;

@ccclass
export class MenuScreen extends cc.Component {
    @property
    playBtn: cc.Button = null!;

    public onLoad() {
        this.playBtn.node.on('click', this.onPlayClick, this);
    }

    private onPlayClick() {

    }
}
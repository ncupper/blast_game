const { ccclass, property } = cc._decorator;

@ccclass
export class ResultPopup extends cc.Component {
    @property(cc.Node)
    public winContent: cc.Node = null!;
    
    @property(cc.Node)
    public loseContent: cc.Node = null!;

    @property(cc.Button)
    public playBtn: cc.Button = null!;

    private _playCallback: () => void = null!;

    protected onLoad(): void {
        this.playBtn.node.on('click', this.onPlayButtonClick, this);
    }

    private onPlayButtonClick(): void {
        this.node.active = false;
        this._playCallback();
    }

    public show(isWin: boolean, playCallback: () => void): void {
        this.node.active = true;
        this.winContent.active = isWin,
        this.loseContent.active = !isWin;
        this._playCallback = playCallback;
    }
}
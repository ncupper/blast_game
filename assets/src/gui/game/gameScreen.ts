import { GameConfig } from "../../configs/gameConfig";
import getResolver from "../../DIResolver";
import getEventBus from "../../events/eventBus";
import { GameOverData, MovesChangedData, ScoresChangedData } from "../../events/eventData";
import { GameEvents } from "../../events/gameEvents";
import { Inject } from "../../Framework/DI/Atrributes/InjectAttribute";
import IGame from "../../game/game";
import { ResultPopup } from "./resultPopup";
import TileViewsContainer from "./tileViewsContainer";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameScreen extends cc.Component {
    @property(TileViewsContainer)
    public tilesRoot: TileViewsContainer = null!;
    @property(ResultPopup)
    public resultPopup: ResultPopup = null!;
    @property(cc.Label)
    public movesValue: cc.Label = null!;
    @property(cc.Label)
    public scoresValue: cc.Label = null!;

    @Inject("GameConfig")
    private _config: GameConfig = null!;
    @Inject("IGame")
    private _game: IGame = null!;

    public onLoad() {
        getResolver().inject(this);

        this.resultPopup.node.active = false;

        getEventBus().on(GameEvents.ScoresChanged, this.onScoresChanged, this);
        getEventBus().on(GameEvents.MovesChanged, this.onMovesChanged, this);
        getEventBus().on(GameEvents.GameOver, this.onGameOver, this);
        
        this._game.setup(this._config);
        this.tilesRoot.node.on(cc.Node.EventType.MOUSE_DOWN, this.onTilesClicked, this);
    }

    private onTilesClicked(event: cc.Event.EventMouse) {
        const pos = this.tilesRoot.node.convertToNodeSpaceAR(event.getLocation());
        const cellSize = this.tilesRoot.cellSize;

        const col = Math.trunc(pos.x / cellSize.width);
        const row = Math.trunc(-pos.y / cellSize.height);
        if (col >= 0 && row >= 0 && col < this._config.Width && row < this._config.Height) {
            this._game.cellClicked(col, row);
        }
    }

    private onMovesChanged(data: MovesChangedData) {
        this.movesValue.string = data.value.toString();
    }

    private onScoresChanged(data: ScoresChangedData) {
        this.scoresValue.string = `${data.value}/${this._config.WinScore}`;
    }

    private onGameOver(data: GameOverData) {
        this.resultPopup.show(data.isWin, this._game.restart.bind(this._game));
    }

    public update(dt: number): void {
        this._game.update();
    }
}
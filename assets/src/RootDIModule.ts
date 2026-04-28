import { GameConfig } from "./configs/gameConfig";
import NinjectModule from "./Framework/DI/Core/NinjectModule";
import { Field } from "./game/field/field";
import { Game } from "./game/game";
import { TileCollector } from "./game/tileCollector";
import { TilesPool } from "./gui/game/tilesPool";

export default class RootDIModule extends NinjectModule {
    private _config: GameConfig;

    constructor(config: GameConfig) {
        super();
        this._config = config;;
    }

    get name() {
        return "DIModule";
    }
    
    protected _unbind(service: any): void {}
    
    load(): void {
        this.bind("GameConfig").toConstant(this._config);
        this.bind("IGame").to(Game, true);
        this.bind("IField").to(Field, true);
        this.bind("ITilesPool").to(TilesPool, true);
        this.bind("ITileCollector").to(TileCollector);
    }
}

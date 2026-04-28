import IKernel from "./Framework/DI/Inter/IKernel";
import { registerModule as registerDIModule } from "./DIResolver";
import { GameConfig } from "./configs/gameConfig";
import RootDIModule from "./RootDIModule";
import getSystemLocator from "./game/systems/systemsLocator";
import { TileSpawner } from "./game/systems/tileSpawner";
import { GroupBuilder } from "./game/systems/groupBuilder";
import { GravitySystem } from "./game/systems/gravitySystem";
import { TopSpawnChecker } from "./game/systems/topSpawnChecker";

const { ccclass, property } = cc._decorator;

export const resolver : IKernel = null!;

@ccclass
export class Startup extends cc.Component {
    @property(cc.Prefab)
    gameConfigPrefab: GameConfig = null!;

    onLoad() {
        const systems = getSystemLocator();
        systems.add("ITileSpawner", new TileSpawner());
        systems.add("IGroupBuilder", new GroupBuilder());
        systems.add("IGravitySystem", new GravitySystem());
        systems.add("ITopSpawnChecker", new TopSpawnChecker());

        const config = cc.instantiate(this.gameConfigPrefab).getComponent(GameConfig);
        const di = new RootDIModule(config);
        registerDIModule(di);
    }

    start() {
        cc.director.loadScene('1.game', () => {});
    }
}
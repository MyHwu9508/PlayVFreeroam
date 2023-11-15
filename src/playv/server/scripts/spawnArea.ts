import alt from 'alt-server';
import { spawnLocations } from '../../shared/conf/SpawnConfig';
import { ConVar } from '../../shared/conf/ConVars';

class SpawnAreaManager {
  spawnProtectAreaColshape: alt.Colshape;
  spawnHelpColshape: alt.Colshape;

  constructor() {
    this.spawnProtectAreaColshape = new alt.ColshapeCircle(spawnLocations.default.protectAreaPosition.x, spawnLocations.default.protectAreaPosition.y, ConVar.SPAWN.PROTECT_RADIUS);
    this.spawnHelpColshape = new alt.ColshapeCircle(spawnLocations.default.pedPosition.x, spawnLocations.default.pedPosition.y, ConVar.SPAWN.PLAYER_RADIUS);

    const spawnAreaBlip = new alt.RadiusBlip(
      spawnLocations.default.protectAreaPosition.x,
      spawnLocations.default.protectAreaPosition.y,
      spawnLocations.default.protectAreaPosition.z,
      ConVar.SPAWN.PROTECT_RADIUS,
      true
    );
    spawnAreaBlip.name = 'Safezone';
    spawnAreaBlip.dimension = 0;
    spawnAreaBlip.color = 25;
    spawnAreaBlip.alpha = 100;

    this.spawnProtectAreaColshape.dimension = 0;
    this.spawnHelpColshape.dimension = 0;

    this.registerEvents();
  }

  registerEvents() {
    alt.on('entityEnterColshape', this.onEntityEnterColshape.bind(this));
    alt.on('entityLeaveColshape', this.onEntityLeaveColshape.bind(this));
  }
  //Events.HUD.SET_FLOATING_BUTTONS
  onEntityEnterColshape(colshape: alt.Colshape, entity: alt.BaseObject) {
    if (colshape === this.spawnProtectAreaColshape) {
      if (entity instanceof alt.Player) {
        entity.setLocalMeta('isInSpawnProtectArea', true);
        alt.logDebug(`[SpawnAreaManager] Player ${entity.userData.username} entered spawn area`);
        entity.invincible = true;
      }
    }
    if (colshape === this.spawnHelpColshape) {
      if (entity instanceof alt.Player) {
        entity.setLocalMeta('isInSpawnArea', true);
        entity.emitRaw('setFloatingKeybinds', [
          ['M', 'Menu'],
          ['F2', 'Noclip'],
          ['F3', 'Freecam'],
          ['T', 'Chat'],
          ['O', 'Voice Chat'],
        ]);
      }
      if (entity instanceof alt.Vehicle) {
        entity.driver?.emitRaw('pushToast', 'error', "You can't enter spawn area with vehicle!!!");
        entity.removeFromServer();
      }
    }
  }
  onEntityLeaveColshape(colshape: alt.Colshape, entity: alt.BaseObject) {
    if (colshape === this.spawnProtectAreaColshape) {
      if (entity instanceof alt.Player) {
        entity.setLocalMeta('isInSpawnProtectArea', false);
        alt.logDebug(`[SpawnAreaManager] Player ${entity.userData.username} left spawn area`);
        entity.invincible = entity.getStreamSyncedMeta('inPassiveMode');
      }
    }
    if (colshape === this.spawnHelpColshape) {
      if (entity instanceof alt.Player) {
        entity.setLocalMeta('isInSpawnArea', false);
        entity.emitRaw('setFloatingKeybinds', []);
      }
    }
  }
}

export default new SpawnAreaManager();

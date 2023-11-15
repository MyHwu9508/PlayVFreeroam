import alt from 'alt-server';
import { ConVar } from '../../shared/conf/ConVars';
import { spawnLocations } from '../../shared/conf/SpawnConfig';

alt.on('explosion', (source: alt.Player, type: alt.ExplosionType, pos: alt.Vector3, fx: number, target: null | alt.Entity) => {
  if (!source?.valid) return true;
  if (source.type !== 0) return true; //if not player is source
  if (source.getStreamSyncedMeta('inPassiveMode')) return false; //if in passive mode no explosion dmg
  if (source.dimension === 0) {
    const checkPos = target ? target.pos : pos;
    if (checkPos.distanceTo(spawnLocations.default.protectAreaPosition) <= ConVar.SPAWN.PROTECT_RADIUS) {
      alt.logDebug('prevent explosion in spawn area', source.name, type, pos, fx, target);
      return false;
    }
  }
  return true;
});

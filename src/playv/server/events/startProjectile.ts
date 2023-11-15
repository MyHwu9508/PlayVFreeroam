import alt from 'alt-server';
import { spawnLocations } from '../../shared/conf/SpawnConfig';
import { ConVar } from '../../shared/conf/ConVars';

//Cancelt raketen Projektil
alt.on('startProjectile', (player: alt.Player, pos: alt.Vector3, dir: alt.Vector3, ammoHash: number, weaponHash: number) => {
  if (!player?.valid) return true;
  if (player.dimension !== 0) return true; //if is in another dimension dont care
  if (player.getStreamSyncedMeta('inPassiveMode')) return false;
  if (spawnLocations.default.protectAreaPosition.distanceTo(pos) <= ConVar.SPAWN.PROTECT_RADIUS) {
    alt.logDebug('prevent projectile in spawn area', player.name, pos, dir, ammoHash, weaponHash);
    return false;
  }

  if (player?.valid && player.userData && player.pos.distanceTo(pos) > 5) {
    alt.logDebug('Projectile started 5m away from player?? ', player?.userData?.username, pos, dir, ammoHash, weaponHash, player.pos.distanceTo(pos));
  }

  return true;
});

import alt from 'alt-server';
import { spawnLocations } from '../../shared/conf/SpawnConfig';
import { ConVar } from '../../shared/conf/ConVars';
import { checkPlayerWeaponAllowed } from '../scripts/anticheat';

alt.on('weaponDamage', (source: alt.Player, target: alt.Entity, weaponHash: number, damage: number, offset: alt.Vector3, bodyPart: alt.BodyPart) => {
  if (!source?.valid || !source.userData) return false;
  if (source.getStreamSyncedMeta('inPassiveMode')) return false;

  switch (target.type) {
    case 0: //Player
      {
        const targetPlayer = target as alt.Player;
        if (!targetPlayer?.valid) return false;

        if (Math.random() > 0.8) checkPlayerWeaponAllowed(source, weaponHash);

        if (targetPlayer.getStreamSyncedMeta('inPassiveMode')) return false;
        if (targetPlayer.getStreamSyncedMeta('spawnProtection')) return false;

        if (targetPlayer.dimension === 0) {
          if (targetPlayer.pos.distanceTo(spawnLocations.default.protectAreaPosition) <= ConVar.SPAWN.PROTECT_RADIUS) {
            alt.logDebug(`Player ${source.userData.username} is in spawn protect area, no damage`);
            return false; // kein dmg
          }
        }
        if (targetPlayer.getLocalMeta('isDead')) return false;
        alt.emitClientUnreliable(source, 'showHitmarker', damage, targetPlayer.pos, bodyPart);
      }
      break;
  }
  return true;
});
//TODO test if works

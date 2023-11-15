import alt from 'alt-server';
import { spawnLocations } from '../../shared/conf/SpawnConfig';
import { ConVar } from '../../shared/conf/ConVars';

alt.on('startFire', (player: alt.Player, fires: alt.IFireInfo[]) => {
  if (!player?.valid) return true;
  //cancel any fire in global dim and spawn area > rocket launcher impact
  if (player.dimension !== 0) return true;
  for (const fire of fires) {
    if (fire.pos.distanceTo(spawnLocations.default.protectAreaPosition) <= ConVar.SPAWN.PROTECT_RADIUS) {
      alt.logDebug('prevent fire in spawn area', player.name, fire);
      return false;
    }
  }
  return true; //feuer cancel spawn
});

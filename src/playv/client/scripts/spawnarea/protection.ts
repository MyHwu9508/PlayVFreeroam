import alt from 'alt-client';
import native from 'natives';
import { spawnLocations } from '../../../shared/conf/SpawnConfig';
import { ConVar } from '../../../shared/conf/ConVars';
import { utils } from '../../../shared/utils';
import { pushToast } from '../../ui/hud/toasts';

export function spawnAreaProtectionTick() {
  if (localPlayer.dimension !== 0) return;
  const center = spawnLocations.default.protectAreaPosition;
  const radius = ConVar.SPAWN.PROTECT_RADIUS;
  const pos = utils.vector.moveRelative(localPlayer.pos, new alt.Vector3(0.25, 0.3, 0.45), native.getEntityRotation(localPlayer, 2));
  const isInshootingRange = localPlayer.currentWeapon && 100 + radius > pos.distanceTo(center);
  if (isInshootingRange) {
    const rot = native.getGameplayCamRot(2);
    const intersection = utils.vector.isLookingAtSphere(pos, rot, center, radius);
    if (intersection) {
      const probe = native.startExpensiveSynchronousShapeTestLosProbe(pos.x, pos.y, pos.z, intersection.x, intersection.y, intersection.z, 1, localPlayer, 4);
      const [, hit, , , entityHit] = native.getShapeTestResult(probe);
      native.releaseScriptGuidFromEntity(entityHit);
      if (!hit) {
        localPlayer.blockPVPKeys();
        showCombatInfo();
      }
    }
  } else if(alt.getLocalMeta('isInSpawnProtectArea') || alt.getLocalMeta('inPassiveMode')){
    showCombatInfo();
  }
}


function showCombatInfo(){
  if (localPlayer.currentWeapon !== 2725352035 && (native.isControlPressed(0, 24) || native.isDisabledControlJustPressed(0, 24))) {
    if (alt.hasMeta('timeoutNotifyPVP')) return;
    pushToast('error', `You are in passive mode or spawn protected! You can't damage other players and they can't damage you!`);
    alt.setMeta('timeoutNotifyPVP', true);
    alt.setTimeout(() => {
      alt.deleteMeta('timeoutNotifyPVP');
    }, 2000);
  }
}
import alt from 'alt-client';
import native from 'natives';
import { pushToast } from '../../ui/hud/toasts';
import { ConVar } from '../../../shared/conf/ConVars';

export function teleport(pos: alt.Vector3, rot = new alt.Vector3(0, 0, 0)) {
  if (localPlayer.isInCombat()) {
    pushToast('warning', `You are in combat! Wait ${Math.round(ConVar.RESTRICTIONS.LAST_COMBAT / 1000)}s seconds after your last combat action to use noclip again!`);
    return;
  }
  native.setEntityCoordsNoOffset(localPlayer, pos.x, pos.y, pos.z, false, false, false);
  native.setEntityRotation(localPlayer, rot.x, rot.y, rot.z, 0, true);
}

/* eslint-disable import/exports-last */
import alt from 'alt-client';
import native from 'natives';
import { setFloatingButtons } from '../ui/hud/floatingKeybinds';
import { keybindManager } from '../systems/keybinds';
import { permissions } from '../systems/access/permissions';
import { pushToast } from '../ui/hud/toasts';
import { ConVar } from '../../shared/conf/ConVars';

const noclipKeybinds = [
  ['F2', 'Leave Noclip'],
  ['Ctl', 'Down'],
  ['␣', 'Up'],
  ['🖱️', 'Change speed'],
  ['⇧', 'Fast Forward'],
] as [string, string][];
let active = false;
let speed = 1;
let noclipEntity: alt.Entity;

const disabledControlls = {
  ChangeSpeedUp: 15, //Scroll Up
  ChangeSpeedDown: 14, //Scroll down
  UpSpaceBar: 22, // jump
  FastForward: 21, // LShift
  Down: 36, // LCtrl
  Forward: 71, //W
  Backwards: 72, //S
  Left: 63, //A
  Right: 64, //D
  disableWeaponWheel: 37, // has no key bound to it, just disable
};

export function noclipTick() {
  if (!active) return;
  const newEntity = localPlayer.vehicle ? localPlayer.vehicle : localPlayer;
  if (noclipEntity !== newEntity) {
    toggleNoclipWithPerm();
    return;
  }

  localPlayer.blockPVPKeys();

  for (const key in disabledControlls) {
    native.disableControlAction(0, disabledControlls[key], true);
  }

  native.disableControlAction(0, 99, true); //INPUT_VEH_SELECT_NEXT_WEAPON
  native.disableControlAction(0, 115, true); //INPUT_VEH_FLY_SELECT_NEXT_WEAPON
  native.disableControlAction(0, 261, true); //INPUT_PREV_WEAPON
  native.disableControlAction(0, 262, true); //INPUT_PREV_WEAPON
  native.disableControlAction(0, 14, true); //	INPUT_WEAPON_WHEEL_NEXT
  native.disableControlAction(0, 15, true); //INPUT_WEAPON_WHEEL_PREV
  native.disableControlAction(0, 16, true); //INPUT_SELECT_NEXT_WEAPON
  native.disableControlAction(0, 17, true); //INPUT_SELECT_NEXT_WEAPON
  native.disableControlAction(0, 81, true); //INPUT_VEH_NEXT_RADIO
  native.disableControlAction(0, 82, true); //INPUT_VEH_NEXT_RADIO

  //Speed Adjust
  if (native.isDisabledControlJustPressed(0, disabledControlls.ChangeSpeedDown)) {
    speed /= 1.2;
  }

  if (native.isDisabledControlJustPressed(0, disabledControlls.ChangeSpeedUp)) {
    speed *= 1.2;
  }

  speed = Math.min(Math.max(speed, 0.1), 30);

  let moveSpeed = speed;
  if (native.isDisabledControlPressed(0, disabledControlls.FastForward)) {
    moveSpeed += 4.5;
    moveSpeed *= 2;
  }

  if (alt.getMeta('showHud')) {
    alt.Utils.drawText2dThisFrame('Speed: ' + moveSpeed.toFixed(2), { x: 0.03, y: 0.005 }, 4, 0.5, new alt.RGBA(255, 255, 255, 200), true, true, 1);
  }

  moveSpeed = (moveSpeed / (1 / native.getFrameTime())) * 60;

  //Camera adjust to GTA bounds
  const camRot = native.getGameplayCamRot(2);
  const fitted = {
    z: ((camRot.x + 70) / 114) * 358,
    yx: camRot.z,
  };

  const zPerc = (fitted.z / 360) * 2 - 1;
  const zMod = 1 - Math.abs(zPerc);
  //Calc movementdirection
  const translation = {
    x: Math.cos(((fitted.yx + 90) * Math.PI) / 180),
    y: Math.sin(((fitted.yx + 90) * Math.PI) / 180),
    z: zPerc,
  };

  const offset = {
    x: translation.x * (moveSpeed + 0.1),
    z: translation.z * (moveSpeed + 0.1),
    y: translation.y * (moveSpeed + 0.1),
  };

  const combinedOffset = {
    x: 0,
    y: 0,
    z: 0,
  };
  //Add offset to pos
  if (native.isDisabledControlPressed(0, disabledControlls.Forward)) {
    combinedOffset.x += offset.x * zMod;
    combinedOffset.y += offset.y * zMod;
    combinedOffset.z += offset.z;
  }
  if (native.isDisabledControlPressed(0, disabledControlls.Backwards)) {
    combinedOffset.x -= offset.x * zMod;
    combinedOffset.y -= offset.y * zMod;
    combinedOffset.z -= offset.z;
  }
  if (native.isDisabledControlPressed(0, disabledControlls.Right)) {
    combinedOffset.y -= offset.x;
    combinedOffset.x += offset.y;
  }
  if (native.isDisabledControlPressed(0, disabledControlls.Left)) {
    combinedOffset.y += offset.x;
    combinedOffset.x -= offset.y;
  }
  if (native.isDisabledControlPressed(0, disabledControlls.UpSpaceBar)) {
    combinedOffset.z += 0.4 * (moveSpeed + 0.1);
  }
  if (native.isDisabledControlPressed(0, disabledControlls.Down)) {
    combinedOffset.z += -0.4 * (moveSpeed + 0.1);
  }

  const pos = noclipEntity.pos;
  const newPos = {
    x: pos.x + combinedOffset.x,
    y: pos.y + combinedOffset.y,
    z: pos.z + combinedOffset.z,
  };

  // let heading = native.getEntityHeading(noclipEntity);
  native.setEntityVelocity(noclipEntity, 0, 0, 0);
  native.setEntityRotation(noclipEntity, 0, 0, 0, 0, false);
  native.setEntityHeading(noclipEntity, native.getGameplayCamRelativeHeading());
  native.setEntityCoordsNoOffset(noclipEntity, newPos.x, newPos.y, newPos.z, true, true, true);
}

export function setNoclip(state: boolean) {
  if (state === active) return;
  active = state;

  if (state) {
    noclipEntity = localPlayer.vehicle ? localPlayer.vehicle : localPlayer;
    alt.emitServer('setNoclipState', localPlayer.vehicle?.remoteID, state);
    setFloatingButtons(noclipKeybinds);
    native.clearPedTasks(localPlayer);
    native.clearPedSecondaryTask(localPlayer);
    //  native.setPedCanRagdoll(localPlayer, false); // stop annoying falling animation :)
  } else {
    setFloatingButtons([]);
    if (noclipEntity !== undefined && noclipEntity.valid) {
      alt.emitServer('setNoclipState', noclipEntity.type === 1 ? noclipEntity.remoteID : undefined, state);
      const [foundGround, groundCoord] = native.getGroundZFor3dCoord(noclipEntity.pos.x, noclipEntity.pos.y, noclipEntity.pos.z, 0, false, false);
      if (foundGround && Math.abs(noclipEntity.pos.z - groundCoord) < 20) {
        native.setEntityCoordsNoOffset(noclipEntity, noclipEntity.pos.x, noclipEntity.pos.y, groundCoord + 1, false, false, false);
        if (localPlayer.vehicle) {
          native.setVehicleOnGroundProperly(localPlayer.vehicle, 5);
        }
      }
    }
  }
}

function toggleNoclipWithPerm() {
  if (!permissions.can('noclip') && !active) {
    pushToast('warning', 'You do not have permission to use noclip! Ask the lobby owner for permission!');
    return;
  }

  if (localPlayer.isInCombat() && !active) {
    pushToast('warning', `You are in combat! Wait ${Math.round(ConVar.RESTRICTIONS.LAST_COMBAT / 1000)}s seconds after your last combat action to use noclip again!`);
    return;
  }

  if (localPlayer.vehicle && localPlayer.seat !== 1 && !active) {
    pushToast('warning', `You can't use noclip while being a passenger!`);
    return;
  }

  setNoclip(!active);
  permissions.setStateActive('noclip', active);
}

keybindManager.registerEvent('keybind.noclip', toggleNoclipWithPerm);

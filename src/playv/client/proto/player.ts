import alt from 'alt-client';
import native from 'natives';
import { ConVar } from '../../shared/conf/ConVars';

declare module 'alt-client' {
  export interface Player {
    hasWebviewActive(): boolean;
    initDefaultVariables(): void;
    blockPVPKeys(): void; //needs to be run every tick!
    stopAnimation(): void;
    isInCombat(): boolean;

    playAnimation(
      dict: string,
      name: string,
      cancelPrevoiusAnim?: boolean,
      duration?: number,
      blendInSpeed?: number,
      blendOutSpeed?: number,
      playBackRate?: number,
      lockX?: boolean,
      lockY?: boolean,
      lockZ?: boolean,
      flag?: number
    ): void;
  }
}

// const DISABLED_CONTROLS = {
//   ATTACK: 24,
//   AIM: 25,
//   RELOAD: 45,
//   VEH_ATTACK: 69,
//   VEH_ATTACK_2: 70,
//   VEH_PASSENGER_AIM: 91,
//   VEH_PASSENGER_ATTACK: 92,
//   VEH_FLY_ATTACK: 114,
//   MELEE_ATTACK_LIGHT: 140,
//   MELEE_ATTACK_HEAVY: 141,
//   MELEE_ATTACK_ALTERNATE: 142,
//   MELEE_ATTACK_BLOCK: 143,
//   ATTACK2: 257,
//   MELEE_ATTACK_1: 263,
//   MELEE_ATTACK_2: 264,
//   VEH_MELEE_LEFT: 346,
//   VEH_MELEE_RIGHT: 347,
//   VEH_FLY_ATTACK_2: 331,
// };

alt.Player.prototype.isInCombat = function isPlayerInCombat() {
  return Date.now() - alt.getMeta('lastCombat') < ConVar.RESTRICTIONS.LAST_COMBAT;
};

alt.Player.prototype.blockPVPKeys = function blockPVPKeys() {
  native.disableControlAction(0, 24, true);
  //native.disableControlAction(0, 25, true); INPUT_AIM
  native.disableControlAction(0, 45, true);
  native.disableControlAction(0, 68, true);
  native.disableControlAction(0, 69, true);
  native.disableControlAction(0, 70, true);
  native.disableControlAction(0, 91, true);
  native.disableControlAction(0, 92, true);
  native.disableControlAction(0, 114, true);
  native.disableControlAction(0, 140, true);
  native.disableControlAction(0, 141, true);
  native.disableControlAction(0, 142, true);
  native.disableControlAction(0, 143, true);
  native.disableControlAction(0, 257, true);
  native.disableControlAction(0, 263, true);
  native.disableControlAction(0, 264, true);
  native.disableControlAction(0, 346, true);
  native.disableControlAction(0, 347, true);
  native.disableControlAction(0, 331, true);

  native.disableControlAction(0, 65, true);
  native.disableControlAction(0, 66, true);
  native.disableControlAction(0, 67, true);
  native.disableControlAction(0, 283, true);
  native.disableControlAction(0, 284, true);
  native.disableControlAction(0, 330, true);
};

alt.Player.prototype.stopAnimation = function stopAnimation() {
  native.clearPedTasks(this);
  native.clearPedSecondaryTask(this);
};

alt.Player.prototype.playAnimation = async function playAnimation(
  dict: string,
  name: string,
  cancelPrevoiusAnim = false,
  duration = -1,
  blendInSpeed = -1,
  blendOutSpeed = -1,
  playBackRate = 1,
  lockX = false,
  lockY = false,
  lockZ = false,
  flag = 33
) {
  await alt.Utils.requestAnimDict(dict, 3000);
  if (cancelPrevoiusAnim) {
    native.clearPedTasks(this);
    native.clearPedSecondaryTask(this);
  }
  // alt.log(`[${dict},${name}]`);
  native.taskPlayAnim(this, dict, name, blendInSpeed, blendOutSpeed, duration, flag, playBackRate, lockX, lockY, lockZ);
  //TODO alt:V V15?
  // alt.emitServerRaW(Events.PLAYER.PLAY_ANIMATION, {
  //   dict,
  //   name,
  //   cancelPrevoiusAnim,
  //   blendInSpeed,
  //   blendOutSpeed,
  //   duration,
  //   flag,
  //   playBackRate,
  //   lockX,
  //   lockY,
  //   lockZ,
  // });
};

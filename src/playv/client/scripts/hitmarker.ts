import alt from 'alt-client';
import native from 'natives';
import { LocalStorage } from '../systems/localStorage';
import { playSound } from '../ui/hud/sounds';
import { showHitmarker } from '../ui/hud/hitmarker';
import { getLobbySetting } from '../systems/lobby';

alt.onServer('showHitmarker', handleHit);
// alt.on('entityHitEntity', (damager: alt.Entity, target: alt.Entity, weaponHash: number) => {
//   const [, bone] = native.getPedLastDamageBone(target.scriptID);
//   handleHit(Math.random() * 29, target.pos, bone === 20);
// });

type hitmarker = {
  position: alt.Vector3;
  count: number;
  isHeadshot: boolean;
  amount: number;
};

class HitMarkers {
  list: hitmarker[] = [];

  public add(amount: number, position: alt.Vector3, isHeadshot: boolean) {
    this.list.push({
      amount: amount,
      position: position,
      count: 0,
      isHeadshot: isHeadshot,
    });
  }

  tick() {
    this.list.forEach(element => {
      alt.Utils.drawText3dThisFrame(
        element.amount.toString(), //msg
        element.position,
        2, //fontt
        0.3, //scale
        new alt.RGBA(
          element.isHeadshot == true ? 200 : 255, //r
          element.isHeadshot == true ? 0 : 255, //g
          element.isHeadshot == true ? 0 : 255, //b
          230 - element.count
        ),
        true, //outline
        false
      );

      element.count += 3;
      element.position.add(0, 0, 0.015);

      if (element.count > 229) {
        const find = hitmarkers.list.findIndex(x => x == element);
        hitmarkers.list.splice(find, 1);
      }
    });
  }
}

export const hitmarkers = new HitMarkers();

function handleHit(damage: number, targetPos: alt.Vector3, bodyPart: number) {
  const isHeadshot = bodyPart === 20 && getLobbySetting('headshot');
  if (LocalStorage.get('hitsound') && LocalStorage.get('soundsVolume') > 0) {
    playSound(`hitsound${isHeadshot ? 'headshot' : 'regular'}`);
  }

  if (LocalStorage.get('hitmarker')) {
    showHitmarker();
  }

  if (LocalStorage.get('damageMarker')) {
    hitmarkers.add(Math.round(damage), new alt.Vector3(targetPos.x, targetPos.y, targetPos.z).add(0, 0, 1.1 + 0.02 * targetPos.distanceTo(localPlayer.pos)), isHeadshot);
  }
}

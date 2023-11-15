import alt from 'alt-client';
import native from 'natives';
import { getLobbySetting } from '../../systems/lobby';
import { getRandomInt } from '../../../shared/utils/math/numbers';
import { spawnPositions } from '../../../shared/data/spawnPositions';
import _ from 'lodash';
import { pushToast } from '../../ui/hud/toasts';
import { permissions } from '../../systems/access/permissions';
import { cancelHeal } from '../healkeys';

alt.onServer('playerDied', playerDied);

export async function playerDied() {
  logDebug('playerDied');
  if (permissions.getStateActive('healing')) {
    cancelHeal(false);
  }
  await alt.Utils.wait(getLobbySetting('respawnTimeout') as number);
  switch (getLobbySetting('respawnAt')) {
    case 'On Death Position':
      alt.emitServer('requestRespawn', localPlayer.pos.add(0, 0, 1), localPlayer.rot);
      break;

    case 'Random Around':
      {
        const randomPos = localPlayer.pos.randomPositionAround(getLobbySetting('respawnOption') as number);
        const [, spawnPos] = native.getNthClosestVehicleNode(randomPos.x, randomPos.y, randomPos.z, getRandomInt(1, 10), new alt.Vector3(0), 1, 3, 0);

        alt.emitServer('requestRespawn', new alt.Vector3(spawnPos.x, spawnPos.y, spawnPos.z + 1), new alt.Vector3(0, 0, getRandomInt(-3, 3)));
      }
      break;

    case 'Positions':
      {
        const positionctx = spawnPositions[getLobbySetting('respawnOption') as number];
        if (!positionctx) {
          logError('lobby', 'respawn', 'Positions', `PositionID ${getLobbySetting('respawnOption')} not found!`);
          return;
        }

        for (const possiblePosition of _.shuffle(positionctx.spawns)) {
          const pos = new alt.Vector3(possiblePosition.x, possiblePosition.y, possiblePosition.z);
          const rot = new alt.Vector3(0, 0, possiblePosition.rot);
          //if we are way too far away just respawn at the first position
          if (pos.distanceTo(localPlayer.pos) > 500) {
            alt.emitServer('requestRespawn', new alt.Vector3(pos.x, pos.y, pos.z), rot);
            return;
          }
          const playerNearSpawn = alt.Utils.getClosestPlayer({ pos: pos, range: 10 });
          if (playerNearSpawn) continue;
          alt.emitServer('requestRespawn', new alt.Vector3(pos.x, pos.y, pos.z), rot);
          return;
        }
        pushToast('information', 'No free spawn position found! You will be respawned at your death position.');
        alt.emitServer('requestRespawn', localPlayer.pos.add(0, 0, 1), localPlayer.rot);
      }

      break;
  }
}

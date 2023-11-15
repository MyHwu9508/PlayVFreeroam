import alt from 'alt-client';
import native from 'natives';

//import { updatePedChar } from '../../hud/CharCreator/charSync';
import { typewriterInstance } from './typeWriterEffect';
import { spawnLocations } from '../../../shared/conf/SpawnConfig';
import { updatePedChar } from '../../ui/charEditor/charSync';
import { currentAveragePing } from '../../utils/ping';
import { ConVar } from '../../../shared/conf/ConVars';

const spawnPedChar = JSON.parse(alt.File.read('@assets/spawnPedChar.json'));

alt.on('disconnect', () => {
  if (ped) {
    native.deleteEntity(ped);
  }
});

let ped: number;
export async function createSpawnPed() {
  ped = native.createPed(
    4,
    alt.hash('MP_M_Freemode_01'),
    spawnLocations.default.pedPosition.x,
    spawnLocations.default.pedPosition.y,
    spawnLocations.default.pedPosition.z,
    spawnLocations.default.pedRotation.z,
    false,
    true
  );

  native.setEntityAsMissionEntity(ped, true, false);
  native.freezeEntityPosition(ped, true);
  native.setPedCanRagdoll(ped, false);
  native.taskSetBlockingOfNonTemporaryEvents(ped, true);
  native.setBlockingOfNonTemporaryEvents(ped, true);
  native.setPedFleeAttributes(ped, 0, false);
  native.setPedCombatAttributes(ped, 17, true);
  native.setEntityInvincible(ped, true);
  native.setPedSeeingRange(ped, 0);

  await alt.Utils.requestAnimDict(spawnLocations.default.pedAnimation[0]);
  updatePedChar(ped, spawnPedChar);
  native.setPedComponentVariation(ped, 3, 15, 0, 0); //torso
  native.setPedComponentVariation(ped, 4, 132, 2, 0); //legs
  native.setPedComponentVariation(ped, 6, 113, 0, 0); //shoes
  native.setPedComponentVariation(ped, 8, 15, 2, 0); //undershirtt
  native.setPedComponentVariation(ped, 11, 405, 0, 0); //top
  native.setPedPropIndex(ped, 1, 5, 0, true, 0); //glass
  native.setPedPropIndex(ped, 2, 41, 0, true, 0); //ear

  native.taskPlayAnim(ped, spawnLocations.default.pedAnimation[0], spawnLocations.default.pedAnimation[1], 8.0, 0.0, -1, 1, 0, false, false, false);
  typewriterInstance.setPed(ped);
}

export async function handleSpawnAreaPed(ped: alt.Ped) {
  try {
    await alt.Utils.waitFor(() => ped.scriptID !== 0 && ped.isSpawned, 5000);
  } catch {
    logDebug('err loading spawn peds...');
  }
  native.setPedMaxHealth(ped.scriptID, 99999);
  native.setEntityHealth(ped.scriptID, 99999, 2);
  native.setRagdollBlockingFlags(ped.scriptID, 2);
  native.setPedCanRagdoll(ped.scriptID, false);
  native.setEntityInvincible(ped.scriptID, true);
  native.setPedSuffersCriticalHits(ped.scriptID, false);

  //maybe became netowner > give task
  await alt.Utils.wait(1000 + currentAveragePing);
  if (ped.netOwner === localPlayer) {
    await alt.Utils.wait(3000);
    if (ped?.scriptID === undefined) return;
    native.taskWanderInArea(
      ped.scriptID,
      spawnLocations.default.pedPosition.x, //ofset?
      spawnLocations.default.pedPosition.y, //ofset?
      spawnLocations.default.pedPosition.z,
      ConVar.SPAWN.PED_WALKING_RADIUS,
      0, //m to patrol
      30.0 //s between
    );
  }
}
export async function checkForSpawnPedsFleeing() {
  if (!alt.getLocalMeta('isInSpawnProtectArea')) return;
  const streamedPeds = alt.Ped.streamedIn;
  for (const ped of streamedPeds) {
    if (ped.getStreamSyncedMeta('isSpawnAreaPed') && ped.netOwner === localPlayer) {
      if (native.isPedFleeing(ped.scriptID)) {
        native.clearPedTasks(ped.scriptID);
        handleSpawnAreaPed(ped);
        return;
      }
      if (native.isEntityInWater(ped.scriptID) || ped.pos.distanceTo(spawnLocations.default.pedPosition) > ConVar.SPAWN.PED_MAXRADIUS) {
        native.setEntityCoords(
          ped.scriptID,
          spawnLocations.default.spawnAreaPedsPosition.x + Math.random(),
          spawnLocations.default.spawnAreaPedsPosition.y,
          spawnLocations.default.spawnAreaPedsPosition.z + 1,
          false,
          false,
          false,
          false
        );
        handleSpawnAreaPed(ped);
        return;
      }
    }
  }
}

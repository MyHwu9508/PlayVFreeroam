import alt from 'alt-client';
import native from 'natives';
import { handleTrafficVehicle } from '../systems/pedSync';
import { handleSpawnAreaPed } from '../scripts/spawnarea/spawnPed';

alt.on('netOwnerChange', (entity: alt.Entity, owner: alt.Player, oldOwner: alt.Player) => {
  if (entity.hasStreamSyncedMeta('T_ped')) {
    if (owner === localPlayer && oldOwner !== null) {
      //migrated vehicle handle
      handleTrafficVehicle(entity as alt.Vehicle);
    }
  }
  if (entity.hasStreamSyncedMeta('isSpawnAreaPed')) {
    if (owner === localPlayer) handleSpawnAreaPed(entity as alt.Ped);
  }
});

import alt from 'alt-client';
import native from 'natives';
import { syncNitro } from '../scripts/nitro';
import { applyStanceData, setVehicleEngineAudio } from '../scripts/vehicles';
import { setPlayerInPassiveMode, setVehicleInPassiveMode } from '../scripts/passiveMode';

alt.on('streamSyncedMetaChange', (object: alt.BaseObject, key: string, value) => {
  if (!object?.valid) return;
  if (object.type === 1) {
    const vehicle = object as alt.Vehicle;
    switch (key) {
      case 'inPassiveMode':
        if (value) {
          setVehicleInPassiveMode(vehicle);
        }
        break;
      case 'nitroOn':
        syncNitro(vehicle, value);
        break;
      case 'customEngineSound':
        setVehicleEngineAudio(vehicle, value);
        break;
      case 'stanceSync':
        if (value !== undefined) {
          applyStanceData(vehicle, value);
        }
        break;
      case 'mutedSiren':
        native.setVehicleHasMutedSirens(vehicle, value);
        break;
      case 'isInNoClip':
        native.freezeEntityPosition(vehicle, value);
        native.setEntityCollision(vehicle, !value, !value);
        break;
    }
  } else if (object.type === 18) {
    //LocalPlayer
    switch (key) {
      case 'inPassiveMode':
        setPlayerInPassiveMode(value);
        break;

      case 'spawnProtection':
        native.setEntityAlpha(localPlayer, value ? 150 : 255, false);
        break;
    }
  } else if (object.type === 0) {
    //player
    const player = object as alt.Player;
    switch (key) {
      case 'spawnProtection':
        logDebug(`Setting spawn protection for ${player.name} to ${value}`);
        native.setEntityAlpha(player, value ? 150 : 255, false);
        break;
      case 'isInNoClip':
        native.freezeEntityPosition(player, value);
        native.setEntityCollision(player, !value, !value);
        break;
    }
  }
});

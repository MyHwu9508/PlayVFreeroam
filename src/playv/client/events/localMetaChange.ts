import alt from 'alt-client';
import native from 'natives';
import { typewriterInstance } from '../scripts/spawnarea/typeWriterEffect';
import { applyLobbyFlags } from '../systems/lobby';
import { setPlayerInPassiveMode } from '../scripts/passiveMode';

alt.on('localMetaChange', (key: string, value) => {
  switch (key) {
    case 'isInSpawnArea':
      typewriterInstance.setActive(value);
      break;
    case 'isInSpawnProtectArea':
      native.setPedConfigFlag(localPlayer, 26, value); //PCF_DontAllowToBeDraggedOutOfVehicle = 26 Prevents a ped from being able to be dragged out of a car
      break;
    case 'adminVisibility':
      logDebug(`Setting admin visibility to ${value}`);
      native.setEntityAlpha(localPlayer, value ? 255 : 150, false);
      break;
    case 'lobbySettings':
      applyLobbyFlags();
      break;
  }
});

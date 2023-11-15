import alt from 'alt-server';
import { altvVoiceServerModuleInstance } from '../scripts/voice';
import { removeAllPlayerVehicles } from '../scripts/vehicles/misc';
import { deletePlayerBlip } from '../scripts/blips';
import { customLobby } from '../systems/lobby/customLobbys';
import chalk from 'chalk';

alt.on('playerDisconnect', playerDisconnect);

function playerDisconnect(player: alt.Player) {
  alt.log(chalk['gray'](`Player Disconnected: ${player?.userData?.username}, ${player?.cloudID}`));
  removeAllPlayerVehicles(player);
  altvVoiceServerModuleInstance.removePlayerFromChannels(player);
  player.saveToDB(); //save player on disconnect bc why not
  deletePlayerBlip(player);
  if (player.hasLocalMeta('customLobbyOwner')) {
    alt.logDebug('closing lobby bc owner left');
    customLobby.close(player.getLocalMeta('customLobbyOwner'));
  } else {
    alt.logDebug('leaving lobby bc player left');
    customLobby.leave(player.getLocalMeta('dimension'), player);
  }
}

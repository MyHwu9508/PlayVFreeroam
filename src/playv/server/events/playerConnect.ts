/// <reference types="@altv/types-client" />
/// <reference types="@altv/types-natives" />
import * as alt from 'alt-server';
import { ConVar } from '../../shared/conf/ConVars';
import { spawnLocations } from '../../shared/conf/SpawnConfig';
import { startLoginFlow } from '../scripts/login/loginFlow';

alt.on('playerConnect', playerConnect);

async function playerConnect(player: alt.Player) {
  if (!alt.debug && alt.getNetTime() < ConVar.LOGIN.STARTUP_DELAY) {
    player.customKick('The server is not started yet, please try again in a few seconds!');
    return;
  }
  //TODO TEMP OFF WEGEN R* SERVER PROBLEME
  // switch (player.socialID) {
  //   case '0':
  //     player.customKick('Please start your GTA5 in online mode!');
  //     break;

  //   case '488923086':
  //     player.customKick(
  //       'EN: Please buy a legal copy of GTA5 to join the server, you are using a cracked version! RU: Пожалуйста, купите легальную копию GTA5, чтобы присоединиться к серверу, вы используете взломанную версию!'
  //     );
  //     break;
  // }

  if (player.cloudID === '0' || player.cloudAuthResult !== 0) {
    if (!alt.hasBenefit(1)) {
      alt.logError('Server has no Cloud Auth benefit, using hwidHash instead! DO NOT USE IN PRODUCTION!!!!');
      alt.logError('Implement your own login method, or consider subscribing to alt:V for the Clout Auth benefit!!!');
    } else {
      player.customKick('Error while logging in. Please make sure you own a legit copy of GTA5 and are not using the offline mode!');
      return;
    }
  }

  player.initVariables(); //set default variables and invincible ON
  player.setIntoDimension(player.privateDimension);
  player.model = 'mp_f_freemode_01'; //set default model to spawn
  player.spawn(spawnLocations.default.playerPosition.randomPositionAround(2).add(0, 0, 0.5)); //spawn in spawnarea
  player.rot = spawnLocations.default.playerRotation.toRadians(); //look towards saved pos
  player.invincible = true; //set invincible ON on Join
  player.streamed = false; //dont stream player
}

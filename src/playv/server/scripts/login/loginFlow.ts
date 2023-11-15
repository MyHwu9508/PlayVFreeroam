/// <reference types="@altv/types-client" />
/// <reference types="@altv/types-natives" />
import * as alt from 'alt-server';
import log from '../../utils/logger';
import { DiscordUser, getDiscordUserFromPlayer } from './generateUser';
import { ConVar } from '../../../shared/conf/ConVars';
import { AppDataSource } from '../../systems/db/TypeORM';
import { PUser } from '../../entities/puser';
import { checkPlayerForBans } from '../banCheck';
import { requestUsernameWindow } from '../setUsername';
import { spawnLocations } from '../../../shared/conf/SpawnConfig';
import { initPlayTimeCounter } from '../playtime';
import { altvVoiceServerModuleInstance } from '../voice';
import { applyUsedFirstNewCharacter } from '../characters/character';
import { customLobby } from '../../systems/lobby/customLobbys';
import { discordBotSocket } from '../../systems/webServer/sockets';
import { createPlayerBlip } from '../blips';

alt.onClient('pleaseLogin', startLoginFlow);

// eslint-disable-next-line import/exports-last
export async function startLoginFlow(player: alt.Player) {
  log('information', `[${player.id}] ${player.name} started the login process.`);
  if (!player?.valid) return;
  if (player.getMeta('isLoggingIn')) {
    player.customKick('ERROR LOGIN FLOW');
    return;
  }
  player.setMeta('isLoggingIn', true);
  player.emitRaw('startLoginFlow');

  const loginPlayerRes = await getUserDataFromDB(player);
  if (!loginPlayerRes) {
    alt.log('Error while login! ' + player.id, player.name, player.cloudID || player.hwidHash);
  }

  if (!player.userData.discordID || ConVar.DEBUG.FORCE_SHOW_DISCORD_BUTTON) {
    if (alt.hasBenefit(1)) {
      //only used then cloudID is available
      player.emitRaw('setDiscordButtonVisible', true);
    }
  }

  const res = checkPlayerForBans(player);
  if (res) {
    player.addLog('Login', res, 'red');
    player.customKick(res);
    return;
  }

  if (player.userData.discordID) discordBotSocket.emit('player:altRole', player.userData.discordID);

  if (player.hasMeta('firstTimeLogin') || player.userData.username === 'pending') {
    await requestUsernameWindow(player);
  }
  player.spawn(spawnLocations.default.playerPosition.randomPositionAround(2).add(0, 0, 0.5)); //spawn in spawnarea
  player.rot = spawnLocations.default.playerRotation.toRadians(); //look towards saved pos

  applyUsedFirstNewCharacter(player);

  player.setStreamSyncedMeta('username', player.userData.username);
  player.setStreamSyncedMeta('authlevel', player.userData.authlevel);

  initPlayTimeCounter(player);
  altvVoiceServerModuleInstance.playerConnected(player);

  if (player.userData.authlevel > 0) {
    player.emitRaw('allowAdminPage');
  }
  createPlayerBlip(player);
  player.streamed = true;
  customLobby.join(0, player);
  player.setLocalMeta('isLoggedIn', true);
  player.emitRaw('endLoginFlow');
}

async function getUserDataFromDB(player: alt.Player) {
  if (!player?.valid) return false;
  let userFromDatabase = await AppDataSource.manager.findOneBy(PUser, {
    cloudID: player.cloudID || player.hwidHash,
  });
  if (alt.debug) log('debug', JSON.stringify(userFromDatabase), true);
  if (!userFromDatabase) {
    userFromDatabase = await registerNewAccountForPlayer(player);
  } else {
    userFromDatabase.lastIP = player.authToken ?? '';
    userFromDatabase.loginCount++;
    if (userFromDatabase.socialClubName !== player.socialClubName && player.socialClubName?.length < 100) {
      userFromDatabase.socialClubName = player.socialClubName ?? '';
    }
    AppDataSource.manager.save(userFromDatabase);
  }
  if (!userFromDatabase) {
    //if the user is still null, something went wrong Try again
    player.customKick('Error while login! Please try again! If this error persists, try restarting your Discord application or remove the authorization for the PlayV.mp bot!');
    alt.logDebug('Error while login! ' + player.cloudID || player.hwidHash);
    return false;
  }
  player.userData = userFromDatabase; //the magic to link the profile to the user
  return true;
}

async function registerNewAccountForPlayer(player: alt.Player) {
  if (!player?.valid) return null;
  const newAccount = new PUser();
  newAccount.altVUsername = player.name.slice(0, 100) ?? '';
  newAccount.authlevel = 0;
  newAccount.isMuted = false;
  newAccount.loginCount = 1;
  newAccount.playtimeMinutes = 0;
  newAccount.socialClubName = player.socialClubName?.slice(0, 100) ?? '';
  newAccount.socialID = player.socialID;
  newAccount.username = 'pending';
  newAccount.warns = 0;
  newAccount.lastIP = player.authToken ?? '';
  newAccount.cloudID = player.cloudID || player.hwidHash;

  await AppDataSource.manager.save(newAccount);
  player.addLog('Login', 'Player account registered!', 'greenBright');
  log('pink', `[LOGIN:${player.hwidHash}] Registered a new account.`);
  player.setMeta('firstTimeLogin', true);
  return newAccount;
}

import fs from 'fs-extra';
import alt from 'alt-server';
import { AdminListData } from '../../../shared/types/types';
import { banPlayer, kickPlayer, setMutedPlayer, warnPlayer } from './playerManagement';
import { generateUsername } from 'unique-username-generator';
import { getRandomInt } from '../../../shared/utils/math/numbers';
import { allPlayerBlips } from '../blips';
import { getRankBlipColor } from '../../../shared/conf/Ranks';

alt.onRpc('A_GetPlayerList', getPlayerList);
alt.onClient('A_Action', actionHandler);
alt.onClient('A_DeleteVehByID', deleteVehByID);
alt.onClient('A_ChangePed', changePed);
alt.onClient('A_SetVisible', setVisible);
alt.onClient('A_SetAnonymize', setHideAdminStatus);
alt.onClient('A_ToggleGlobalChat', toggleGlobalChat);

function toggleGlobalChat(player: alt.Player, state: boolean) {
  if (!isPlayerCrewmate(player)) return;
  alt.setSyncedMeta('isGlobalChatMuted', state);
  player.pushToast('information', `Globaler Chat ist nun ${state ? 'aus' : 'an'}`);
}

function setHideAdminStatus(player: alt.Player, state: boolean) {
  if (!isPlayerCrewmate(player)) return;
  player.pushToast('information', `Du bist nun ${state ? 'anonym' : 'nicht mehr anonym'}`);

  if (state) {
    player.setStreamSyncedMeta('username', generateUsername('', getRandomInt(1, 4), getRandomInt(4, 15)));
    player.setStreamSyncedMeta('authlevel', 0);
  } else {
    player.setStreamSyncedMeta('username', player.userData.username);
    player.setStreamSyncedMeta('authlevel', player.userData.authlevel);
  }
}
function setVisible(player: alt.Player, visible: boolean) {
  if (!isPlayerCrewmate(player)) return;
  player.streamed = visible;
  player.setLocalMeta('adminVisibility', visible);
  const blip = allPlayerBlips.get(player.id);
  if (!blip) return alt.logError('blip not found?' + player.id);
  blip.visible = visible;
  blip.color = getRankBlipColor(player.getStreamSyncedMeta('authlevel'));
}

function changePed(player: alt.Player, ped: string) {
  if (!isPlayerCrewmate(player)) return;
  player.model = ped;
  player.heal();
}

function deleteVehByID(player: alt.Player, vehID: number) {
  if (!isPlayerCrewmate(player)) return;
  const vehicle = alt.Vehicle.getByID(vehID);
  if (vehicle && vehicle.valid) vehicle.removeFromServer();
}

async function getPlayerList(player: alt.Player) {
  if (!isPlayerCrewmate(player)) return undefined;

  const players = alt.Player.all;
  const dataToSend: AdminListData[] = [];
  for (let i = 0; i < players.length; i++) {
    const p = players[i];
    if (!p || !p.valid || !p.userData) continue;
    //  if (p === player) continue;
    dataToSend.push({
      userID: p.userData.userID,
      gameID: p.id,
      name: p.userData.username,
      authlevel: p.userData.authlevel,
      position: p.pos,
      dimension: p.dimension,
      isMuted: p.userData.isMuted ?? false,
      warns: p.userData.warns,
      spawnedVehicles: p.vehicles.length,
      ping: p.ping,
      playtime: p.userData.playtimeMinutes,
    });
  }
  if (dataToSend.length === 0) return undefined;
  alt.logDebug('send to admin: ' + JSON.stringify(dataToSend));
  return dataToSend;
}

function actionHandler(player: alt.Player, action: string, targetID: number, ...args: any[]) {
  if (!isPlayerCrewmate(player)) return;
  alt.logDebug('actionHandler: ' + action + ' ' + targetID + ' ' + args);
  const targetPlayer = alt.Player.all.find(p => p && p.valid && p.id === targetID);
  if (!targetPlayer) return player.pushToast('error', 'Target not found :(');

  switch (action) {
    case 'TP zum Spieler':
      player.pos = targetPlayer.pos;
      player.dimension = targetPlayer.dimension;
      break;
    case 'TP Spieler zu mir':
      if (targetPlayer.dimension !== player.dimension) return player.pushToast('warning', 'Spieler wurde nicht TPd! Er ist in einer anderen Dimension. Du musst dich zu ihm tpn');
      targetPlayer.pos = player.pos;
      break;

    case 'Verwarnen':
      warnPlayer(player.userData, targetPlayer, args[0]);
      break;

    case 'Kick':
      kickPlayer(player.userData, targetPlayer, args[0]);
      break;

    case 'Mute':
    case 'Unmute':
      setMutedPlayer(player.userData, targetPlayer, action === 'Mute' ? true : false, args[0]);
      break;

    case 'Perma Ban':
      banPlayer(player.userData, targetPlayer, 'PERMANENT', args[0]);
      break;

    case 'Temp Ban':
      banPlayer(player.userData, targetPlayer, args[1], args[0]);
      break;
  }
}

function isPlayerCrewmate(player: alt.Player) {
  if (!player || !player.valid || !player.userData) return false;
  const isCrewmate = player.userData.authlevel > 0;
  if (!isCrewmate) {
    player.addLog('AdminAction', 'Tried to run admin actions without being admin???', 'bgRedBright');
    return false;
  }
  return true;
}

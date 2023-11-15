import alt from 'alt-server';
import { customLobby } from './customLobbys';
import { ConVar } from '../../../shared/conf/ConVars';
import { doesStringContainBadWord } from '../../utils/badWords';
import { Lobby, LobbySettings } from '../../../shared/types/lobby';
import { setPlayerPassiveMode } from '../../scripts/passiveMode';
import { allWeaponHashes } from '../../../shared/data/weapons';
import { spawnPositions } from '../../../shared/data/spawnPositions';
import { getRandomInt } from '../../../shared/utils/math/numbers';
import _ from 'lodash';
import { allPlayerBlips } from '../../scripts/blips';
import { destroyTrafficVehicle } from '../pedsync/manager';

alt.onRpc('getLobbyData', playerSendLobbyInfo);
alt.onRpc('requestJoinLobby', playerTryJoinLobby);
alt.onRpc('tryCreateLobby', playerTryCreateLobby);
alt.onRpc('setLobbySetting', playerTrySetLobbySetting);
alt.onRpc('setLobbyPermission', playerTrySetLobbyPermission);
alt.onRpc('getLobbySettings', playerGetLobbySettings);
alt.onRpc('getLobbyPermissions', playerGetLobbyPermissions);
alt.onRpc('getLobbyPlayers', playerGetLobbyPlayers);
alt.onRpc('getLobbyAllowedWeapons', playerGetLobbyAllowedWeapons);
alt.onRpc('setLobbyAllowedWeaponsBulk', setLobbyAllowedWeaponsBulk);
alt.onRpc('toggleLobbyAllowedWeapon', toggleLobbyAllowedWeapon);
alt.onRpc('closeOwnLobby', closeOwnLobby);
alt.onRpc('getOwnLobbyData', getOwnLobbyData);
alt.onClient('playerKickPlayerFromLobby', playerKickPlayerFromLobby);
alt.onClient('invitePlayerToLobby', invitePlayerToLobby);
alt.onRpc('getInvitePlayers', getInvitePlayers);
alt.onRpc('setLobbyConfig', setLobbyConfig);

function setLobbyConfig(player: alt.Player, config: keyof Lobby, value: any) {
  if (!player?.valid) return false;
  if (!player.hasLocalMeta('customLobbyOwner')) {
    player.addLog('Other', 'setLobbyConfig: Player is not a lobby owner! ' + player.id);
    return false;
  }
  alt.logDebug('setLobbyConfig', player.userData.username, config, value, player.getLocalMeta('customLobbyOwner'));
  const res = customLobby.setLobbyConfig(player.getLocalMeta('customLobbyOwner'), config, value);
  if (!res) player.pushToast('warning', 'Failed to set lobby config! Maybe your name or description is containing not allowed words!');
  return res;
}

function invitePlayerToLobby(player: alt.Player, targetId: number) {
  if (!player.hasLocalMeta('customLobbyOwner')) return;
  const lobby = customLobby.currentLobbys.get(player.getLocalMeta('customLobbyOwner'));
  if (!lobby) return;
  const target = alt.Player.getByID(targetId);
  if (!target) return;
  if (lobby.players.find(p => p.id === target.id)) return;

  if (target.getLocalMeta('lobbyInvite') === player.getLocalMeta('customLobbyOwner')) return player.pushToast('warning', 'You have already invited this player!');
  if (target.hasLocalMeta('lobbyInvite')) return player.pushToast('warning', 'This player is already invited to a lobby, please wait a few seconds!');

  target.pushToast('information', `${player.getStreamSyncedMeta('username')} invited you to his lobby ${lobby.name}! Press the interaction key to accept the invite (default E)!`);
  target.setLocalMeta('lobbyInvite', lobby.dimension);
  const invitedToLobby = lobby.dimension;
  alt.setTimeout(() => {
    if (target?.valid && target.getLocalMeta('lobbyInvite') === invitedToLobby) {
      target.pushToast('information', 'Lobby invite expired!');
      target.deleteLocalMeta('lobbyInvite');
    }
  }, 10000);
}

function getInvitePlayers(player: alt.Player) {
  const lobby = customLobby.currentLobbys.get(player.getLocalMeta('customLobbyOwner'));
  if (!lobby) return undefined;
  return alt.Player.all.filter(p => p?.valid && p.userData && p !== player && !lobby.players.find(lp => lp.id === p.id)).map(p => [p.id, p.getStreamSyncedMeta('username')]);
  // return alt.Player.all.filter(p => p?.valid && p.userData && !lobby.players.find(lp => lp.id === p.id)).map(p => [p.id, p.userData.username]);
}

function playerKickPlayerFromLobby(player: alt.Player, targetId: number) {
  if (!player.hasLocalMeta('customLobbyOwner')) return;
  const lobby = customLobby.currentLobbys.get(player.getLocalMeta('customLobbyOwner'));
  if (!lobby) return;
  const target = alt.Player.getByID(targetId);
  if (!target) return;
  if (!lobby.players.find(p => p.id === target.id)) return;
  customLobby.join(0, target);
  target.pushToast('information', 'You have been kicked from the lobby!');
}

function playerGetLobbyPlayers(player: alt.Player) {
  const lobby = customLobby.currentLobbys.get(player.getLocalMeta('customLobbyOwner'));
  if (!lobby) return undefined;
  return lobby.players.filter(x => x?.valid && x !== player && x.getLocalMeta('adminVisibility') !== false).map(p => [p.id, p.getStreamSyncedMeta('username')]); //hide hidden admins in lobbys
}

function getOwnLobbyData(player: alt.Player) {
  const lobby = customLobby.currentLobbys.get(player.getLocalMeta('customLobbyOwner'));
  if (!lobby) return undefined;
  return _.omit(lobby, 'players', 'owner');
}

function closeOwnLobby(player: alt.Player) {
  if (!player.hasLocalMeta('customLobbyOwner')) return;
  customLobby.close(player.getLocalMeta('customLobbyOwner'));
  player.pushToast('success', 'Lobby closed!');
}

async function playerGetLobbyAllowedWeapons(player: alt.Player) {
  return customLobby.currentLobbys.get(player.getLocalMeta('customLobbyOwner'))?.allowedWeapons;
}

async function playerGetLobbyPermissions(player: alt.Player) {
  return customLobby.currentLobbys.get(player.getLocalMeta('customLobbyOwner'))?.permissions;
}
async function playerGetLobbySettings(player: alt.Player) {
  return customLobby.currentLobbys.get(player.getLocalMeta('customLobbyOwner'))?.settings;
}

async function playerTryCreateLobby(player: alt.Player, name: string, description: string) {
  if (name?.length < 3) name = player.userData.username;
  if (!player.canPerformAction('lobby.create', 30000)) return false;
  if (name.trim().length < 3 || name.length > ConVar.LOBBY.MAX_NAME_LENGTH || description.length > ConVar.LOBBY.MAX_DESCRIPTION_LENGTH) {
    player.pushToast('warning', 'Name or description is too short or too long!');
    return false;
  }
  if (doesStringContainBadWord(name, true, ConVar.CHAT.LEVINSTEIN_THRESHOLD) || doesStringContainBadWord(description, true, ConVar.CHAT.LEVINSTEIN_THRESHOLD)) {
    player.pushToast('warning', 'Name or description contains bad words!');
    return false;
  }

  if (player.hasLocalMeta('customLobbyOwner')) {
    player.pushToast('warning', 'You already own a lobby!');
    return false;
  }

  if (Object.values(customLobby.currentLobbys).find(lobby => lobby.name.toLowerCase() === name.toLowerCase())) {
    player.pushToast('warning', 'Lobby with this name already exists!');
    return false;
  }

  const lobbyDim = customLobby.getFreeDimension();
  customLobby.create(lobbyDim, name, player, description);
  customLobby.join(lobbyDim, player);
  return true;
}

async function playerSendLobbyInfo(player: alt.Player) {
  const dataToSend = [];
  customLobby.currentLobbys.forEach((lobby, key, map) => {
    if (lobby.public === false && lobby.owner !== player && player.userData.authlevel < 1) return;
    dataToSend.push({
      name: lobby.name,
      owner: lobby.owner?.getStreamSyncedMeta('username') || 'Server',
      players: lobby.players.length,
      dimension: lobby.dimension,
      description: lobby.description,
      settings: lobby.settings,
      permissions: lobby.permissions,
      public: lobby.public,
    });
  });
  return dataToSend;
}

async function playerTryJoinLobby(player: alt.Player, dimension: number) {
  alt.logDebug('playerTryJoinLobby', player.name, dimension);
  if (!player.canPerformAction('lobby.tryjoin', 5000)) return false;
  if (player.dimension === dimension) {
    player.pushToast('warning', 'You are already in this lobby!');
    return false;
  }
  if (customLobby.currentLobbys.has(dimension)) {
    const lobby = customLobby.currentLobbys.get(dimension);

    if (!lobby.public && player.getLocalMeta('lobbyInvite') !== dimension) {
      player.addLog('Anticheat', 'PLAYER TRIED TO JOIN PRIVATE LOBBY???' + dimension);
      return false;
    }

    if (player.getLocalMeta('lobbyInvite') === dimension) {
      player.deleteLocalMeta('lobbyInvite');
      player.emitRaw('setFloatingKeybinds', []);
    }

    customLobby.join(dimension, player);
  }
  return true; //return false when not good
}

async function playerTrySetLobbySetting(player: alt.Player, setting: keyof LobbySettings, value: any) {
  if (!player?.valid) return false;
  if (!player.hasLocalMeta('customLobbyOwner')) {
    alt.log('playerTrySetLobbySetting: Player is not a lobby owner! ' + player.id);
    return false;
  }
  alt.logDebug('playerTrySetLobbySetting', player.name, setting, value, player.getLocalMeta('customLobbyOwner'));
  customLobby.setSetting(player.getLocalMeta('customLobbyOwner'), setting, value);

  switch (setting) {
    case 'passiveMode': {
      if (value === 'Normal') break;
      const lobbyplayers = customLobby.getPlayers(player.getLocalMeta('customLobbyOwner'));
      if (!lobbyplayers) {
        alt.logError('playerTrySetLobbySetting: lobbyplayers is undefined!');
        return false;
      }
      for (const p of lobbyplayers) {
        setPlayerPassiveMode(p, value === 'Force On', true);
      }
      break;
    }

    case 'respawnAt':
    case 'respawnOption':
      {
        const lobbySettings = customLobby.getLobbySettings(player.getLocalMeta('customLobbyOwner'));
        const lobbyPlayers = customLobby.getPlayers(player.getLocalMeta('customLobbyOwner'));

        if (setting === 'respawnAt' && value !== 'Positions') return true;
        if (setting === 'respawnOption' && lobbySettings.respawnAt !== 'Positions') return true;

        if (!lobbyPlayers || lobbyPlayers.length === 0) return true;
        if (!spawnPositions[lobbySettings.respawnOption]?.spawns) return true; //when no spawns found just return here (might be issue with menu and changing stuff JIT)

        for (const player of lobbyPlayers) {
          const getRandomPos = spawnPositions[lobbySettings.respawnOption].spawns[getRandomInt(0, spawnPositions[lobbySettings.respawnOption].spawns.length - 1)];
          player.pos = new alt.Vector3(getRandomPos.x, getRandomPos.y, getRandomPos.z);
        }
      }
      break;

    case 'blips': {
      const lobbyplayers = customLobby.getPlayers(player.getLocalMeta('customLobbyOwner'));
      if (!lobbyplayers) {
        alt.logError('playerTrySetLobbySetting: lobbyplayers is undefined!');
        return false;
      }
      for (const p of lobbyplayers) {
        const blip = allPlayerBlips.get(p.id);
        if (!blip) continue;
        blip.visible = value;
      }
      break;
    }

    case 'traffic_enabled': {
      if (!value) {
        const allLobbyVehicles = alt.Vehicle.all.filter(v => v?.valid && v.dimension === player.getLocalMeta('customLobbyOwner') && v.getStreamSyncedMeta('T_ped'));
        for (const v of allLobbyVehicles) {
          destroyTrafficVehicle(v);
        }
      }
    }
  }
  return true;
}

async function playerTrySetLobbyPermission(player: alt.Player, permission: string, value: boolean) {
  if (!player?.valid) return false;
  if (!player.hasLocalMeta('customLobbyOwner')) {
    alt.log('playerTrySetLobbyPermission: Player is not a lobby owner! ' + player.id);
    return false;
  }
  alt.logDebug('playerTrySetLobbyPermission', player.name, permission, value, player.getLocalMeta('customLobbyOwner'));
  customLobby.setPermission(player.getLocalMeta('customLobbyOwner'), permission, value);
  return true;
}

async function setLobbyAllowedWeaponsBulk(player: alt.Player, state: boolean) {
  if (!player?.valid) return false;
  if (!player.hasLocalMeta('customLobbyOwner')) {
    alt.log('playerTrySetLobbyPermission: Player is not a lobby owner! ' + player.id);
    return false;
  }
  customLobby.setLobbyWeapons(player.getLocalMeta('customLobbyOwner'), state ? allWeaponHashes : []);
  return true;
}

async function toggleLobbyAllowedWeapon(player: alt.Player, weapon: number, state: boolean) {
  if (!player?.valid) return false;
  if (!player.hasLocalMeta('customLobbyOwner')) {
    alt.log('playerTrySetLobbyPermission: Player is not a lobby owner! ' + player.id);
    return false;
  }
  customLobby.updateLobbyWeapon(player.getLocalMeta('customLobbyOwner'), weapon, state);
  return true;
}

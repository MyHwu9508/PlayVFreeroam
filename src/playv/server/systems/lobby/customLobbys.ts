import { Lobby, LobbySettings, defaultAllowedWeapons, defaultLobbyPermissions, defaultLobbySettings } from '../../../shared/types/lobby';
import alt from 'alt-server';
import { permissions } from '../access/permissions';
import { ConVar } from '../../../shared/conf/ConVars';
import _ from 'lodash';
import { removeAllPlayerVehicles } from '../../scripts/vehicles/misc';
import { setPlayerPassiveMode } from '../../scripts/passiveMode';
import { giveLobbyWeapons } from '../../scripts/weapons';
import { spawnPositions } from '../../../shared/data/spawnPositions';
import { getRandomInt } from '../../../shared/utils/math/numbers';
import { doesStringContainBadWord } from '../../utils/badWords';
import { allPlayerBlips } from '../../scripts/blips';
const currentLobbys: Map<number, Lobby> = new Map(); //DIM, lobbyObj

function getFreeDimension() {
  let dim = ConVar.LOBBY.DIM_MIN;
  while (currentLobbys.has(dim)) {
    dim++;
  }
  return dim;
}

function create(dimension: number, name: string, owner: alt.Player, description: string, settings?: LobbySettings, permissions?: string[], allowedWeapons?: number[]) {
  const newLobby: Lobby = {
    settings: settings || _.clone(defaultLobbySettings),
    permissions: permissions || _.clone(defaultLobbyPermissions),
    name,
    owner,
    dimension,
    description,
    allowedWeapons: allowedWeapons || _.clone(defaultAllowedWeapons),
    public: true,
    get players() {
      return alt.Player.all.filter(x => x?.valid && x.getLocalMeta('dimension') === this.dimension);
    },
  };
  currentLobbys.set(dimension, newLobby);
  if (owner && owner?.valid) {
    owner.setLocalMeta('customLobbyOwner', dimension);
    owner.pushToast('success', `Custom Lobby ${name} created!`);
  }
}

function close(dimension: number) {
  alt.logDebug('closing lobby start' + dimension);
  if (dimension === 0) return alt.logError('Trying to close freeroam lobby?');
  const lobby = currentLobbys.get(dimension);
  if (!lobby) {
    alt.logError('Trying to close a lobby that does not exist!');
    return;
  }
  if (lobby.owner && lobby.owner.valid) {
    lobby.owner.deleteLocalMeta('customLobbyOwner');
  }
  lobby.players.forEach(player => {
    alt.logDebug('CLOSING LOBBY ohne valid! ' + player?.userData.username);
    if (player?.valid) {
      alt.logDebug('CLOSING LOBBY! ' + player.userData.username);
      join(0, player);
      player.pushToast('information', 'This lobby has been closed. You are now back in Freeroam!');
    }
  });
  currentLobbys.delete(dimension);
}

function setSetting<K extends keyof LobbySettings>(dimension: number, setting: K, value: LobbySettings[K]) {
  if (dimension === 0) {
    alt.logError('WTF someone tried to change settings in our freeroam lobby!!!!!' + setting + ' ' + value);
    return;
  }
  const lobby = currentLobbys.get(dimension);
  if (!lobby) return alt.logError('Trying to set a setting on a lobby that does not exist!');
  lobby.settings[setting] = value;
  for (const player of lobby.players) {
    player.setLocalMeta('lobbySettings', lobby.settings);
    // player.emitRaw('pushChatMessage', {
    //   text: `Lobby setting ${setting} changed to ${value}`,
    //   tagColor: '#ff00ff',
    //   range: 'Lobby',
    //   username: lobby.owner.getStreamSyncedMeta('username'),
    // });
  }
}

function setLobbyWeapons(dimension: number, weapons: number[]) {
  if (dimension === 0) {
    alt.logError('Trying to set a weapons on freeroam lobby?' + weapons);
    return false;
  }
  const lobby = currentLobbys.get(dimension);
  if (!lobby) return alt.logError('Trying to set a setting on a lobby that does not exist!');
  lobby.allowedWeapons = weapons;
  for (const player of getPlayers(dimension)) {
    giveLobbyWeapons(player, dimension);
  }
}

function updateLobbyWeapon(dimension: number, weapon: number, active: boolean) {
  if (dimension === 0) {
    alt.logError('Trying to set a weapon on freeroam lobby?' + weapon);
    return false;
  }
  const lobby = currentLobbys.get(dimension);
  if (!lobby) return alt.logError('Trying to set a setting on a lobby that does not exist!');
  if (active) {
    if (!lobby.allowedWeapons.includes(weapon)) lobby.allowedWeapons.push(weapon);
  } else {
    const index = lobby.allowedWeapons.indexOf(weapon);
    if (index !== -1) {
      lobby.allowedWeapons.splice(index, 1);
    }
  }
  for (const player of getPlayers(dimension)) {
    giveLobbyWeapons(player, dimension);
  }
}

function getWeapons(dimension: number) {
  const lobby = currentLobbys.get(dimension);
  if (!lobby) {
    alt.logDebug('Trying to get weapons from a lobby that does not exist! ' + dimension);
    return [];
  }
  return lobby.allowedWeapons;
}

function setPermission(dimension: number, permission: string, active: boolean) {
  if (dimension === 0) {
    alt.logError('Trying to set a permission on freeroam lobby?' + permission + ' ' + active);
    return false;
  }
  const lobby = currentLobbys.get(dimension);
  if (!lobby) return alt.logError('Trying to set a permission on a lobby that does not exist!');
  if (active) {
    if (!lobby.permissions.includes(permission)) lobby.permissions.push(permission);
  } else {
    const index = lobby.permissions.indexOf(permission);
    if (index !== -1) {
      lobby.permissions.splice(index, 1);
    }
  }
  for (const player of lobby.players) {
    permissions.setPermissions(player, lobby.permissions);
  }
}

function join(dimension: number, player: alt.Player) {
  const oldLobby = currentLobbys.get(player.getLocalMeta('dimension'));
  const newLobby = currentLobbys.get(dimension);
  alt.logDebug('leavelobby awdwdawdadw', player.name, oldLobby?.dimension);
  if (oldLobby) {
    alt.logDebug('leavelobby', player.name, oldLobby.dimension);
    leave(player.dimension, player);
  }
  removeAllPlayerVehicles(player);
  alt.logDebug('joinlobby', player.name, dimension);
  player.setIntoDimension(dimension);
  if (!newLobby.players.includes(player)) newLobby.players.push(player);
  player.setLocalMeta('lobbySettings', newLobby.settings);
  permissions.setPermissions(player, newLobby.permissions);
  player.pushToast('success', 'You joined lobby ' + newLobby.name + '!');

  const blip = allPlayerBlips.get(player.id);
  if (blip) {
    blip.dimension = dimension;
    blip.visible = newLobby.settings.blips && player.getLocalMeta('adminVisibility') !== false;
  }

  setPlayerPassiveMode(player, newLobby.settings.passiveMode === 'Force On', true);
  player.health = player.getLocalMeta('lobbySettings').respawnHealth + 100;
  player.armour = player.getLocalMeta('lobbySettings').respawnArmour;

  giveLobbyWeapons(player, dimension);

  if (newLobby.dimension === 0) return; //nono in freeroam
  for (const p of newLobby.players) {
    if (!p?.valid || p === player) continue;
    alt.emitClientUnreliable(p, 'pushToast', 'information', player?.getStreamSyncedMeta('username') + ' joined the lobby!');
  }

  if (newLobby.settings.respawnAt === 'Positions') {
    const randomSpawn = spawnPositions[newLobby.settings.respawnOption].spawns[getRandomInt(0, spawnPositions[newLobby.settings.respawnOption].spawns.length - 1)];
    player.pos = new alt.Vector3(randomSpawn.x, randomSpawn.y, randomSpawn.z);
  }
}

function leave(dimension: number, player: alt.Player) {
  const lobby = currentLobbys.get(dimension);
  if (!lobby) return alt.logDebug('Trying to leave a lobby that does not exist! ' + dimension); //passiert vor dem kompletten join bspw?
  const index = lobby.players.indexOf(player);
  if (index !== -1) {
    lobby.players.splice(index, 1);
  }
  if (lobby.dimension === 0) return; //nono in freeroam
  for (const p of lobby.players) {
    if (!p?.valid || p === player) continue;
    alt.emitClientUnreliable(p, 'pushToast', 'information', player?.getStreamSyncedMeta('username') + ' left the lobby!');
  }
}

function getLobbySettings(dimension: number) {
  const lobby = currentLobbys.get(dimension);
  if (!lobby) {
    alt.logError('Trying to get settings from a lobby that does not exist!');
    return defaultLobbySettings;
  }
  return lobby.settings;
}

function getPlayers(dimension: number) {
  const lobby = currentLobbys.get(dimension);
  if (!lobby) {
    alt.logError('Trying to get players from a lobby that does not exist!');
    return [];
  }
  return lobby.players.filter(x => x?.valid) ?? [];
}

function setLobbyConfig(dimension: number, config: keyof Lobby, value: any) {
  if (dimension === 0) {
    alt.logError('Trying to set a config on freeroam lobby?' + config + ' ' + value);
    return false;
  }
  const lobby = currentLobbys.get(dimension);
  if (!lobby) {
    alt.logError('Trying to set a config from a lobby that does not exist!' + dimension);
    return false;
  }
  switch (config) {
    case 'description':
      if (doesStringContainBadWord(value, true, ConVar.CHAT.LEVINSTEIN_THRESHOLD)) return false;
      lobby.description = value;
      break;

    case 'name':
      if (doesStringContainBadWord(value, true, ConVar.CHAT.LEVINSTEIN_THRESHOLD)) return false;
      lobby.name = value;
      break;

    case 'public':
      lobby.public = value;
      break;
  }
  return true;
}

function getLobby(dimension: number) {
  return currentLobbys.get(dimension);
}

export const customLobby = {
  create,
  close,
  setSetting,
  setPermission,
  join,
  leave,
  currentLobbys,
  getFreeDimension,
  getPlayers,
  getWeapons,
  setLobbyWeapons,
  updateLobbyWeapon,
  getLobbySettings,
  setLobbyConfig,
  getLobby,
};

create(0, 'Freeroam', undefined, 'Default Freeroam Lobby of the #1 Freeroam Server called PlayV.mp');

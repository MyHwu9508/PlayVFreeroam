/* eslint-disable @typescript-eslint/no-unused-vars */
import alt from 'alt-server';
import { LobbyPreset } from '../../entities/lobbyPreset';
import {
  LobbyPresetWithOwner,
  LobbySettings,
  defaultAllowedWeapons,
  defaultLobbyPermissions,
  defaultLobbySettings,
} from '../../../shared/types/lobby';
import { customLobby } from './customLobbys';
import { ConVar } from '../../../shared/conf/ConVars';
import { lobbyPresetRepository } from './presetRepository';
import _ from 'lodash';

alt.onRpc('playerRequestLobbyPresets', playerRequestLobbyPresets);
alt.onClient('saveCurrentLobbyAsPreset', saveCurrentLobbyAsPreset);
alt.onRpc('playerRequestMyLobbyPresets', playerRequestMyLobbyPresets);
alt.onRpc('tryDeleteLobbyPreset', tryDeleteLobbyPreset);
alt.onRpc('tryCreateLobbyFromPreset', tryCreateLobbyFromPreset);

function tryDeleteLobbyPreset(player: alt.Player, presetID: number) {
  const preset = lobbyPresetRepository.getByID(presetID);
  if (!preset) return false;
  if (preset.ownerID !== player.userData.userID) {
    player.addLog('Anticheat', 'Player tried to delete Lobby preset ' + presetID);
    return false;
  }
  lobbyPresetRepository.deletePreset(presetID, player.userData.userID);
  player.pushToast('success', 'Lobby preset deleted! ' + preset.name);
  return true;
}

function playerRequestLobbyPresets() {
  return lobbyPresetRepository.getPreviews();
}

function playerRequestMyLobbyPresets(player: alt.Player) {
  return lobbyPresetRepository.getPreviews().filter((preset) => preset.ownerID === player.userData.userID);
}

function saveCurrentLobbyAsPreset(player: alt.Player) {
  if (!player.canPerformAction('lobby.save', 15000)) return;
  if (
    lobbyPresetRepository.getPreviews().filter((preset) => preset.ownerID === player.userData.userID)?.length >=
    ConVar.LOBBY.MAX_PRESETS
  )
    return player.pushToast('error', `You can only save ${ConVar.LOBBY.MAX_PRESETS} presets!`);

  const lobby = customLobby.getLobby(player.getLocalMeta('customLobbyOwner'));
  if (!lobby) return player.pushToast('error', 'Lobby not found!');

  if (
    _.isEqual(lobby.settings, defaultLobbySettings) &&
    _.isEqual(lobby.permissions, defaultLobbyPermissions) &&
    _.isEqual(lobby.allowedWeapons, defaultAllowedWeapons)
  )
    return player.pushToast(
      'error',
      'You cannot save the default lobby! Please do some changes to save a preset with your favorite settings.',
    );

  const preset: LobbyPresetWithOwner = {
    description: lobby.description,
    id: undefined,
    timeStamp: undefined,
    name: lobby.name,
    ownerID: player.userData.userID,
    permissions: lobby.permissions,
    lobbySettings: lobby.settings,
    allowedWeapons: lobby.allowedWeapons,
    numUsed: 0,
    username: player.userData.username,
  };
  lobbyPresetRepository.save(preset);
  player.pushToast('success', 'Lobby preset saved! ' + preset.name);
}

function tryCreateLobbyFromPreset(player: alt.Player, presetID: number) {
  if (!player.canPerformAction('lobby.create', 30000)) return false;
  const preset = lobbyPresetRepository.getByID(presetID);
  if (!preset) {
    alt.logError('Lobby preset not found while creating! ' + presetID);
    player.pushToast('error', 'Lobby preset not found!');
    return false;
  }
  const dimension = customLobby.getFreeDimension();
  customLobby.create(
    dimension,
    preset.name,
    player,
    preset.description,
    preset.lobbySettings,
    preset.permissions,
    preset.allowedWeapons,
  );
  customLobby.join(dimension, player);
  if (preset.ownerID !== player.userData.userID) {
    preset.numUsed++;
    lobbyPresetRepository.save(preset);
  }
  return true;
}

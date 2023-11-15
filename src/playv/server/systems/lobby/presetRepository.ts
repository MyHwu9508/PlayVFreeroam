import chalk from 'chalk';
import alt from 'alt-server';
import { LobbyPreset } from '../../entities/lobbyPreset';
import { AppDataSource } from '../db/TypeORM';
import { PUser } from '../../entities/puser';
import { LobbyPresetPreview, LobbyPresetWithOwner, LobbySettings, defaultLobbySettings } from '../../../shared/types/lobby';

const PRESETS = new Map<number, LobbyPresetWithOwner>();
const PRESET_PREVIEW = new Map<number, LobbyPresetPreview>();

AppDataSource.getRepository(LobbyPreset)
  .createQueryBuilder('preset')
  .select(['preset.*', 'user.username AS username'])
  .leftJoin(PUser, 'user', 'preset.ownerID = user.userID')
  .getRawMany()
  .then(presets => {
    for (const preset of presets) {
      preset.lobbySettings = makePresetSettingsCompatible(preset.lobbySettings);
      PRESETS.set(preset.id, preset);
      PRESET_PREVIEW.set(preset.id, getLobbyPreview(preset, preset.username));
    }
    alt.log(chalk.bold.overline.underline.magentaBright(`${PRESETS.size} presets cached`));
  });

function getPreviews(): LobbyPresetPreview[] {
  return [...PRESET_PREVIEW.values()];
}

function getByID(lobbyid: number): LobbyPresetWithOwner | undefined {
  return PRESETS.get(lobbyid);
}

async function save(lobby: LobbyPresetWithOwner) {
  const res = await AppDataSource.getRepository(LobbyPreset).save(lobby);
  res.username = lobby.username;
  PRESETS.set(lobby.id, res);
  PRESET_PREVIEW.set(lobby.id, getLobbyPreview(res, lobby.username));
  return res;
}

function deletePreset(lobbyid: number, ownerID: number) {
  AppDataSource.getRepository(LobbyPreset).delete({
    id: lobbyid,
    ownerID: ownerID,
  });
  PRESETS.delete(lobbyid);
  PRESET_PREVIEW.delete(lobbyid);
}

function getLobbyPreview(lobby: LobbyPreset, username: string) {
  return {
    name: lobby.name,
    description: lobby.description,
    ownerID: lobby.ownerID,
    permissions: lobby.permissions,
    passiveMode: lobby.lobbySettings.passiveMode,
    headshot: lobby.lobbySettings.headshot,
    weaponDmgMult: lobby.lobbySettings.weaponDmgMult,
    traffic_enabled: lobby.lobbySettings.traffic_enabled,
    allowedWeapons: lobby.allowedWeapons.length,
    id: lobby.id,
    username: username,
    numUsed: lobby.numUsed,
    allowedWeaponsCount: lobby.allowedWeapons.length,
    noclip: lobby.permissions.includes('noclip'),
  };
}

export const lobbyPresetRepository = {
  getPreviews,
  getByID,
  save,
  deletePreset,
};

function makePresetSettingsCompatible(currentSettings: Partial<LobbySettings>) {
  const lobbySettings: Partial<LobbySettings> = {};
  for (const [key, value] of Object.entries(defaultLobbySettings)) {
    lobbySettings[key] = currentSettings[key] ?? value;
  }
  return lobbySettings;
}

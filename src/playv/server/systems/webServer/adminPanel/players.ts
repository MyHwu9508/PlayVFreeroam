import alt from 'alt-server';
import { PUser } from '../../../entities/puser';
import { VehicleData } from '../../../entities/vehicleData';
import { CharacterData } from '../../../entities/characterData';
import { OutfitData } from '../../../entities/outfitData';
import { AppDataSource } from '../../db/TypeORM';
import { banPlayer, kickPlayer, setMutedPlayer, unbanPlayer, warnPlayer } from '../../../scripts/admin/playerManagement';
import { adminActionLog } from '../../../scripts/admin/logs';
type ListPlayerData = {
  userID: string;
  discordID: string;
  username: string;
  firstSeen: number;
  playtimeMinutes: number;
  lobby: number;
  atSpawn: boolean;
  spawnedVehicles: number;
};

type PlayerData = {
  //DB STATE
  userID: string;
  discordID: string;
  socialID: string;
  socialClubName: string;
  altVUsername: string;
  username: string;
  isMuted: boolean;
  lastIP: string | null; //Auth >= 3
  loginCount: number;
  lastUsernames: string[];
  lastUsernameChange: number;
  lastSeen: number;
  firstSeen: number;
  playtimeMinutes: number;
  authLevel: number;
  warns: number;
  banReason: string | null;
  isBannedUntil: number | null;
  savedVehicles: number;
  savedCharacters: number;
  savedOutfits: number;
  //GAME STATE
  lobby?: number;
  dimension?: number;
  atSpawn?: boolean;
  spawnedVehicles?: number;
  voiceRange?: number;
  godmode?: boolean;
  health?: number;
  armor?: number;
};

export function getPlayerListForAP(cb: (players: Array<ListPlayerData>) => void) {
  const players = alt.Player.all;
  const result: ListPlayerData[] = [];

  for (const player of players) {
    if (!player) continue;
    if (!player.valid) continue;
    if (!player.userData) continue;
    const data: ListPlayerData = {
      userID: player.userData.userID.toString(),
      discordID: player.userData.discordID,
      username: player.userData.username,
      firstSeen: player.userData.firstSeen.getTime(),
      playtimeMinutes: player.userData.playtimeMinutes,
      lobby: player.dimension,
      atSpawn: player.getLocalMeta('isInSpawnProtectArea') as boolean,
      spawnedVehicles: player.vehicles.length,
    };
    result.push(data);
  }
  cb(result);
}

export async function getPlayerData(id: number, cb: (data: PlayerData) => void) {
  const players = alt.Player.all;
  const player = players.find(p => p && p.valid && p.userData.userID === Number(id));

  const savedVehicles = await AppDataSource.manager.count(VehicleData, { where: { owner: { userID: id } } });
  const savedCharacters = await AppDataSource.manager.count(CharacterData, { where: { userID: id } });
  const savedOutfits = await AppDataSource.manager.count(OutfitData, { where: { userID: id } });
  if (!player) {
    const dbUser = await AppDataSource.manager.findOne(PUser, { where: { userID: id } });
    if (!dbUser) return cb(null);
    const data: PlayerData = {
      userID: String(dbUser.userID),
      discordID: dbUser.discordID,
      socialID: dbUser.socialID,
      socialClubName: dbUser.socialClubName,
      altVUsername: dbUser.altVUsername,
      username: dbUser.username,
      isMuted: dbUser.isMuted,
      lastIP: dbUser.lastIP,
      loginCount: dbUser.loginCount,
      lastUsernames: dbUser.lastUsernames,
      lastUsernameChange: dbUser.lastUsernameChange?.getTime(),
      lastSeen: dbUser.lastSeen.getTime(),
      firstSeen: dbUser.firstSeen.getTime(),
      playtimeMinutes: dbUser.playtimeMinutes,
      authLevel: dbUser.authlevel,
      warns: dbUser.warns,
      banReason: dbUser.banReason,
      isBannedUntil: dbUser.isBannedUntil !== null ? dbUser.isBannedUntil.getTime() : null,
      savedVehicles: savedVehicles,
      savedCharacters: savedCharacters,
      savedOutfits: savedOutfits,
    };
    cb(data);
  } else {
    const data: PlayerData = {
      userID: String(player.userData.userID),
      discordID: player.userData.discordID,
      socialID: player.userData.socialID,
      socialClubName: player.userData.socialClubName,
      altVUsername: player.userData.altVUsername,
      username: player.userData.username,
      isMuted: player.userData.isMuted,
      lastIP: player.userData.lastIP,
      loginCount: player.userData.loginCount,
      lastUsernames: player.userData.lastUsernames,
      lastUsernameChange: player.userData.lastUsernameChange.getTime(),
      lastSeen: player.userData.lastSeen.getTime(),
      firstSeen: player.userData.firstSeen.getTime(),
      playtimeMinutes: player.userData.playtimeMinutes,
      authLevel: player.userData.authlevel,
      warns: player.userData.warns,
      banReason: player.userData.banReason,
      isBannedUntil: player.userData.isBannedUntil !== null ? player.userData.isBannedUntil.getTime() : null,
      savedVehicles: savedVehicles,
      savedCharacters: savedCharacters,
      savedOutfits: savedOutfits,
      lobby: player.dimension,
      dimension: player.dimension,
      atSpawn: player.getLocalMeta('isInSpawnProtectArea') as boolean,
      spawnedVehicles: player.vehicles.length,
      voiceRange: player.voiceRange,
      godmode: player.getLocalMeta('invincible') as boolean,
      health: player.health,
      armor: player.armour,
    };
    cb(data);
  }
}

export async function kickPlayerFromAP(discordID: string, id: number, reason: string) {
  const executor = await AppDataSource.manager.findOne(PUser, { where: { discordID: discordID } });
  if (!executor) return;
  const players = alt.Player.all;
  const player = players.find(p => p && p.valid && p.userData.userID === Number(id));
  kickPlayer(executor, player, reason);
}

export async function warnPlayerFromAP(discordID: string, id: number, reason: string) {
  console.log('warnPlayerFromAP', discordID, id, reason);
  const executor = await AppDataSource.manager.findOne(PUser, { where: { discordID: discordID } });
  if (!executor) return;
  warnPlayer(executor, id, reason);
}

export async function banPlayerFromAP(discordID: string, id: number, duration: number | 'PERMANENT', reason: string) {
  console.log('banPlayerFromAP', discordID, id, duration, reason);
  const executor = await AppDataSource.manager.findOne(PUser, { where: { discordID: discordID } });
  if (!executor) return;
  banPlayer(executor, id, duration, reason);
}

export async function unbanPlayerFromAP(discordID: string, id: number, reason: string) {
  const executor = await AppDataSource.manager.findOne(PUser, { where: { discordID: discordID } });
  if (!executor) return;
  unbanPlayer(executor, id, reason);
}

export async function setMutedFromAP(discordID: string, id: number, state: boolean, reason: string) {
  const executor = await AppDataSource.manager.findOne(PUser, { where: { discordID: discordID } });
  if (!executor) return;
  setMutedPlayer(executor, id, state, reason);
}

export async function deleteAllPlayersVehiclesFromAP(discordID: string, id: number) {
  const executor = await AppDataSource.manager.findOne(PUser, { where: { discordID: discordID } });
  if (!executor) return;
  const players = alt.Player.all;
  const player = players.find(p => p && p.valid && p.userData.userID === Number(id));
  if (!player) return;
  for (const vehicle of player.vehicles) {
    if (!vehicle || !vehicle.valid) continue;
    vehicle.destroy();
  }
  adminActionLog(executor, `Deleted all vehicles from {${player.userData.userID}|${player.userData.username}}`);
}

import alt from 'alt-server';
import { PUser } from '../entities/puser';
import chalk from 'chalk';
import type { ColorName } from 'chalk';
import type { NoteType, NotificationType } from '../../shared/types/types';
import { PlayerLog } from '../entities/playerLog';
import { AppDataSource } from '../systems/db/TypeORM';
import { LobbySettings, defaultLobbySettings } from '../../shared/types/lobby';
import { ConVar } from '../../shared/conf/ConVars';
import { allPlayerBlips } from '../scripts/blips';

interface Cooldowns {
  [actionName: string]: number;
}

declare module 'alt-server' {
  export interface Player {
    userData: PUser;
    vehicles: Array<alt.Vehicle>;
    cooldowns: Cooldowns;
    acEmits: number; //num emits/second
    /**
     * Players forever alone dimension
     */
    privateDimension: number;
    voiceRange: number;

    getLobbySetting<K extends keyof LobbySettings>(setting: K): LobbySettings[K];
    initVariables(): void;
    heal(): void;
    isFemale(): boolean;

    addLog(type: NoteType, text: string, color?: ColorName, executor?: number): void;
    customKick(reason: string, executor?: number): void;
    customBan(reason: string, executor?: number): void;
    tempBan(reason: string, time: number, executor?: number): void;
    addWarn(reason: string, executor?: number): void;

    altSetIntoVehicle(vehicle: alt.Vehicle, seat?: number): void;
    saveToDB(): Promise<undefined>;
    pushToast(type: NotificationType, text: string): void;
    setIntoDimension(dimension: number): void;
    canPerformAction(action: string, delay: number): boolean;

    executeNative(nativeName: string, entityType: string, ...args: any[]): void;
  }
}

alt.Player.prototype.getLobbySetting = function getLobbySetting(settingName: keyof LobbySettings) {
  const lobbySettings = this.getLocalMeta('lobbySettings') ?? defaultLobbySettings;
  return lobbySettings[settingName];
};

alt.Player.prototype.heal = function heal() {
  this.health = 200;
  this.armour = 100;
};

alt.Player.prototype.initVariables = function initVariables() {
  this.cooldowns = {};
  this.vehicles = [];
  this.privateDimension = this.id + 1;
  this.voiceRange = 0;
  this.setLocalMeta('invincible', true); //default is invincible!!!
  this.acEmits = 0;
  this.setLocalMeta('permissions', []);
  this.setLocalMeta('states', []);
  this.setMeta('vehSyncNodes', []);
};

alt.Player.prototype.isFemale = function isFemale() {
  return this.model === alt.hash('mp_f_freemode_01');
};

alt.Player.prototype.executeNative = function executeNative(nativeName: string, entityType: string, ...args: any[]) {
  this.emitRaw('executeNative', nativeName, entityType, ...args);
};

alt.Player.prototype.setIntoDimension = function setIntoDimension(dim) {
  alt.logDebug('set into dim ' + this.id + ' > ' + dim);
  this.dimension = dim;
  this.setLocalMeta('dimension', dim);

  const blip = allPlayerBlips.get(this.id);
  if (!blip || !blip.valid) return;
  blip.dimension = dim;
};

alt.Player.prototype.pushToast = function pushToast(type: NotificationType, text: string) {
  this.emitRaw('pushToast', type, text);
};

alt.Player.prototype.customKick = function customKick(reason: string, executor = 0) {
  this.addLog('Kicked', reason, 'redBright', executor);
  this.kick('You have been kicked: ' + reason);
};

alt.Player.prototype.addWarn = function addWarn(reason: string, executor = 0) {
  if (!this.userData) {
    this.addLog('Warned', 'FAILED TO WARN PLAYER!!!!! ' + reason, 'bgRedBright', executor);
    return;
  }
  this.addLog('Warned', reason, 'yellowBright', executor);
  this.userData.warns++;
  if (this.userData.warns >= 3) {
    this.userData.warns = 0;
    this.tempBan('You have been banned 3/3 warns!', 1000 * 60 * 60 * 24 * 7, executor);
  } else {
    this.saveToDB();
  }
};

alt.Player.prototype.customBan = function customBan(reason: string, executor = 0) {
  if (!this.userData) {
    this.addLog('Banned', 'FAILED TO BAN PLAYER!!!!! ' + reason, 'bgRedBright', executor);
    this.kick(reason);
    return;
  }
  this.addLog('Banned', reason, 'redBright', executor);
  this.userData.banReason = reason;
  this.userData.isBannedUntil = new Date('2042,1,1');
  this.saveToDB();
  this.kick('You are permanently from this server! To apply for an unban, please visit our Discord: playv.mp/discord');
};

alt.Player.prototype.tempBan = function tempBan(reason: string, time: number, executor = 0) {
  if (!this.userData) {
    this.addLog('Banned', 'FAILED TO BAN PLAYER!!!!! ' + reason, 'bgRedBright', executor);
    this.kick(reason);
    return;
  }
  this.addLog('Banned', reason + 'ms:' + time, 'redBright', executor);
  this.userData.banReason = reason;

  const banEndTime = Date.now() + time;
  this.userData.isBannedUntil = new Date(banEndTime);

  this.saveToDB();

  this.kick(
    `You have been banned from this server until ${this.userData.isBannedUntil.toUTCString()}. To appeal the ban, kindly visit our Discord server: playv.mp/discord. Your ban reason: ${reason}`
  );
};

alt.Player.prototype.addLog = function log(type: NoteType, text: string, color: ColorName = 'magentaBright', executor: number = 0) {
  if (!this || !this?.valid || !this.userData) {
    alt.log(chalk[color](`[${type}] -> [${this.id}|not logged in]: ${text}`));
    return;
  }
  if (text.length > 1000) text = text.slice(0, 1000);
  const note = new PlayerLog();
  note.type = type;
  note.text = text;
  note.executor = executor;
  note.color = color;
  note.userID = this?.userData?.userID ?? '-1';
  alt.log(chalk[color](`[${type}] -> [${this.userData.username}|${this.userData.userID}]: ${text}`));
  AppDataSource.manager.insert(PlayerLog, note);
};

alt.Player.prototype.saveToDB = async function saveToDB() {
  alt.logDebug('DEBUG: saveToDB', this.userData?.userID);
  if (!this.userData) {
    return alt.logDebug('DEBUG: saveToDB failed, no userdata');
  }
  return AppDataSource.manager.save(this.userData);
};

alt.Player.prototype.altSetIntoVehicle = async function altSetIntoVehicle(vehicle: alt.Vehicle, seat = -1) {
  this.emit('setIntoVehicle', vehicle, seat);
};

alt.Player.prototype.canPerformAction = function canPerformAction(actionName: string, delay: number) {
  if (!this?.valid || !this.userData) {
    alt.log('error can perform action, player invalid?');
    return false;
  }
  if (ConVar.DEBUG.SKIP_COOLDOWNS || (!ConVar.DEBUG.SKIP_COOLDOWNS && this?.userData?.authLevel > 0)) return true; //skip in debug, or for admins
  if (!this.cooldowns[actionName]) {
    this.cooldowns[actionName] = 0;
  }

  const currentTime = Date.now();
  const lastActionTime = this.cooldowns[actionName];

  if (currentTime - lastActionTime >= delay) {
    this.cooldowns[actionName] = currentTime;
    return true;
  } else {
    alt.logDebug(chalk['gray'](`[cooldown] -> [${this.userData?.username}|${this.userData?.userID}]: ${actionName} ${delay}`)); //log all for now
    this.pushToast('error', 'This action is in cooldown!');
    return false;
  }
};

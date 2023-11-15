/* eslint-disable @typescript-eslint/no-unused-vars */
import { permissionStates } from '../conf/access/States';
import { ActivePermissions } from './permissions';

import type altclient from 'alt-client';
import type altserver from 'alt-server';
import { WheelStanceData } from './types';
import type { CharacterData } from '../../server/entities/characterData';
import type { OutfitData } from '../../server/entities/outfitData';
import { LobbySettings } from './lobby';

declare module 'alt-shared' {
  //*Local Meta
  export interface ICustomPlayerLocalMeta {
    permissions: ActivePermissions;
    states: Array<keyof typeof permissionStates>;
    invincible: boolean; //TODO maybe need removal?
    dimension: number;
    isInSpawnArea: boolean;
    isInSpawnProtectArea: boolean;
    playtimeMinutes: number;
    adminVisibility: boolean;
    currentCharacter: number;
    currentCharacterName: string;
    currentCharacterData: CharacterData;
    currentOutfit: number;
    currentOutfitName: string;
    currentOutfitData: Record<string, [number, number]>;
    lobbySettings: LobbySettings;
    isDead: boolean;
    customLobbyOwner: number;
    inPassiveMode: boolean;
    isLoggedIn: boolean;
    lobbyInvite: number;
  }
  //*Synced Meta
  export interface ICustomGlobalSyncedMeta {
    mClothMaxIndex: Record<string, number>;
    fClothMaxIndex: Record<string, number>;
    isGlobalChatMuted: boolean;
  }
  export interface ICustomPlayerSyncedMeta {}
  export interface ICustomPedSyncedMeta {}
  export interface ICustomBaseObjectSyncedMeta {}
  //*Streamed Meta
  export interface ICustomEntityStreamSyncedMeta {
    isInNoClip: boolean;
  }
  export interface ICustomPlayerStreamSyncedMeta {
    username: string;
    isTalking: boolean;
    isChatting: boolean;
    authlevel: number;
    hideAdminStatus: boolean;
    inPassiveMode: boolean;
    spawnProtection: boolean;
  }
  export interface ICustomVehicleStreamSyncedMeta {
    nitroOn: boolean;
    vehicleOwner: number; //PlayerRemoteID
    customEngineSound: string;
    stanceSync: WheelStanceData;
    mutedSiren: boolean;
    T_ped: altclient.Ped | altserver.Ped; //Traffic Sync
    T_justSpawned: boolean; //Traffic Sync
    T_onHighway: boolean; //Traffic Sync
    inPassiveMode: boolean;
  }
  export interface ICustomPedStreamSyncedMeta {
    T_vehicle: altclient.Vehicle; //Traffic Sync
    isSpawnAreaPed: boolean;
  }
  export interface ICustomVirtualEntityStreamSyncedMeta {}
}

declare module 'alt-client' {
  //*Client
  export interface ICustomBaseObjectMeta {}
  export interface ICustomEntityMeta {}
  export interface ICustomBlipMeta {
    lastUpdated: number;
  }
  export interface ICustomCheckpointMeta {}
  export interface ICustomColshapeMeta {}
  export interface ICustomWebViewMeta {}
  export interface ICustomAudioMeta {}
  export interface ICustomPlayerMeta {}
  export interface ICustomLocalPlayerMeta {}
  export interface ICustomVehicleMeta {
    displayName: string;
    turboActivated: boolean;
    wheelInscription: boolean;
    rimCategory: number;
    rimIndex: number;
    rimColor: number;
    primaryBaseColor: number;
    secondaryBaseColor: number;
    pearlColor: number;
    lightsMultiplier: number;
    headlightColor: number;
    godmode: boolean;
    neverDirty: boolean;
    isParkedVehicle: boolean;
    driftModeEnabled: boolean;
  }
  export interface ICustomPedMeta {}
  export interface ICustomGlobalMeta {
    webViewReady: true | undefined;
    introCompleted: boolean;
    showHud: boolean;
    isNitroRunning: boolean; //when players use nitro
    hasWebviewFocus: boolean;
    canBeNetOwner: boolean;
    crazyMazyNametags: boolean;
    keyRemap: true | undefined;
    usedHealRecently: boolean;
    lastCombat: number;
  }
}

declare module 'alt-server' {
  //*Server
  export interface ICustomBaseObjectMeta {}
  export interface ICustomBlipMeta {}
  export interface ICustomColshapeMeta {}
  export interface ICustomCheckpointMeta {}
  export interface ICustomVoiceChannelMeta {}
  export interface ICustomEntityMeta {}
  export interface ICustomPlayerMeta {
    discordUUID: string;
    blip: altserver.PointBlip;
    previousDimension: number;
    vehSyncNodes: [altserver.Vector3, number, boolean][];
    latestWeapon: number;
    changePassiveModeInProgress: boolean;
    playtimeInterval: number;
    firstTimeLogin: boolean;
  }
  export interface ICustomVehicleMeta {
    usingPrimaryRGB: boolean;
    usingSecondaryRGB: boolean;
    activeExtras: number[];
    stuckCount: number;
    lastPos: altserver.Vector3;
    T_recentNetownerChange: number;
  }
}

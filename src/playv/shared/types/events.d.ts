/* eslint-disable @typescript-eslint/no-explicit-any */
import { VehicleData } from '../../server/entities/vehicleData';
import { permissionStates } from '../conf/access/States';
import type { ChatMessage, ChatRanges, CommunityVehicle, KillFeedEntry, ModdedVehicle, NotificationType, SavedVehicle, WheelStanceData } from './types';

import type altclient from 'alt-client';
import type altserver from 'alt-server';
import type altshared from 'alt-shared';
import type { CharacterData } from '../../server/entities/characterData';
import { VehicleHandling } from './vehicleHandling';
import { OutfitData } from '../../server/entities/outfitData';

declare module 'alt-shared' {
  //* emitClient / onServer
  export interface ICustomServerClientEvent {
    syncWeather: (oldWeather: string, newWeather: string, percentWeather2: number) => void;
    pushToast: (variant: NotificationType, content: string) => void;
    executeNative: (nativeName: string, entityType: string, ...args: any[]) => void;
    setIntoVehicle: (vehicle: altclient.Vehicle | altserver.Vehicle, seat?: number) => void;
    startLoginFlow: () => void;
    endLoginFlow: () => void;
    setUsernameWindowOpen: (state: boolean) => void;
    setFloatingKeybinds: (keybinds: Array<[string, string]>) => void;
    setSyncedServerTime: (time: number[]) => void;
    voiceRangeChanged: (range: number) => void;
    removeManageableVehicle: (vehicleID: number) => void;
    pushChatMessage: (message: ChatMessage) => void;
    addManageableVehicle: (vehicle: altclient.Vehicle | altserver.Vehicle, appearanceData?: VehicleData) => void;
    leaveCurrentVehicle(immediately: boolean): void;
    savedVehicleDeleted: (vehicleID: number) => void;
    addCommunityVehicle: (vehicle: CommunityVehicle) => void;
    startCharEditor: () => void;
    allowAdminPage: () => void;
    playerDied: () => void;
    applyLobbyFlags: () => void; //on respawn, player ped change whatever > Reapply lobby flags
    handleWeaponForRespawn: (weapon: number) => void;
    showHitmarker: (amount: number, position: altclient.Vector3, bodyPart: number) => void;
    showKillMessage: (action: string, victimName: string) => void;
    setDiscordButtonVisible: (state: boolean) => void;
    pushKillfeed: (entry: KillFeedEntry) => void;
  }
  //* emitServer / onClient
  export interface ICustomClientServerEvent {
    requestState: (state: keyof typeof permissionStates, active: boolean) => void;
    setNoclipState: (vehicleID: number | undefined, state: boolean) => void;
    requestVehicleNitro: (state: boolean) => void;
    requestUsernameWindow: () => void;
    changeVoiceRange: () => void;
    setIsTalkingMeta: (state: boolean) => void;
    sendChatMessage: (message: string, range: ChatRanges) => void;
    setIsChattingMeta: (state: boolean) => void;
    requestModelSpawnVehicle: (model: string, location: [altshared.Vector3, altshared.Vector3], customPrimaryColor?: altshared.RGBA, customSecondaryColor?: altshared.RGBA) => void;
    runVehicleAction: (vehicleID: number, action: string) => void;
    runVehicleMethod: (method: string, vehicleID: number, ...args: any[]) => void;
    setVehicleAttribute: (attribute: string, vehicleID: number, value: any) => void;
    kickPlayersFromVehicle: (vehicleID: number) => void;
    bulkSetMods: (vehicleID: number, mods: Array<[number, number]>) => void;
    saveCustomVehicle: (vehicleID: number, name: string, publicSave: boolean, handling?: VehicleHandling) => void;
    requestSpawnCustomVehicle: (customVehicleID: number, location: [Vector3, Vector3]) => void;
    deleteCustomVehicle: (customVehicleID: number) => void;
    deleteSpawnedVehicleByID: (vehicleID: number) => void;
    //Char/Outfit
    selectCharacter: (characterID: number) => void;
    createCharacter: (name: string) => void;
    renameCharacter: (characterID: number, newName: string) => void;
    deleteCharacter: (characterID: number) => void;
    duplicateCharacter: (characterID: number, name: string) => void;
    finishCharEditor: (data: CharacterData | undefined) => void;
    randomizeCurrentCharacter: () => void;
    selectOutfit: (outfitID: number) => void;
    createOutfit: (name: string) => void;
    renameOutfit: (outfitID: number, newName: string) => void;
    deleteOutfit: (outfitID: number) => void;
    duplicateOutfit: (outfitID: number, name: string) => void;
    randomizeCurrentOutfit: () => void;
    changeCloth: (component: string, drawable: number, texture: number) => void;
    importCharacter: (char: CharacterData, outfit: OutfitData) => void;
    //
    t_removeVehicle: (vehicleID: number) => void;
    canBeNetOwner: (state: boolean) => void;
    addVehSyncSpawn: (nodes: [altclient.Vector3, number, boolean][]) => void;
    setVehicleSirenSound: (vehicleID: number, sound: boolean) => void;
    confirmTrafficVehicle: (vehicleID: number) => void;
    requestRespawn: (pos: altclient.Vector3, rot: altclient.Vector3) => void;
    syncWheelStance: (vehicleID: number, wheelStanceData: WheelStanceData) => void;
    setVehicleEngineSound: (vehicleID: number, sound: string) => void;
    tryCreateLobby: (name: string, description: string) => void;
    requestSetPassiveMode: (state: boolean) => void;
    stopAnyAnimation: () => void;
    playAnimation: (
      animDict: string,
      animName: string,
      flag?: number,
      playbackRate?: number,
      duration?: number,
      lockX?: boolean,
      lockY?: boolean,
      lockZ?: boolean,
      blendInSpeed?: number,
      blendOutSpeed?: number,
    ) => void;
    requestRefillWeapons: () => void;
    requestHeal: (armor: boolean) => void;
    informServer: (type: string, message: string) => void;
    log1n: (message: string) => void; //Kicks player
    saveCurrentLobbyAsPreset: () => void;
    tryDeleteLobbyPreset: (presetID: number) => void;
    pleaseLogin: () => void;
  }
}

declare module 'alt-server' {
  //* Server only
  export interface ICustomEmitEvent {
    myEvent: (arg1: string, arg2: { key: string; value: number }) => void;
  }
}

declare module 'alt-client' {
  //* Client only
  export interface ICustomEmitEvent {}
}

//* emitPromiseServer / onPromiseClient
export interface PromiseClientServerEvent {
  getSavedVehicles: () => SavedVehicle[];
  getModdedVehicles: () => ModdedVehicle[];
  getCommunityVehicles: () => CommunityVehicle[];
  getSavedOutfits: () => [number, string][];
  getSavedCharacters: () => [number, string][];
  A_GetPlayerList: () => any[];
}
//* emitPromiseClient / onPromiseServer
export interface PromiseServerClientEvent {}
//* Client only
export interface ClientPromiseEmitEvent {
  myEvent: (arg1: string, arg2: { key: string; value: number }) => string;
}
//* Server only
export interface ServerPromiseEmitEvent {
  myEvent: (arg1: string, arg2: { key: string; value: number }) => string;
}

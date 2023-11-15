import { WatermarkPosition } from 'alt-client';
import DefaultKeybinds from './DefaultKeybinds';
import { DefaultSpeedometerConfig, SpeedometerConfig } from './DefaultSpeedometer';

export type StorageKeys = {
  _version: number;
  keybinds: { [key: string]: number | string };
  uiWatermarkPosition: WatermarkPosition;
  ambientsound: boolean;
  uiShowHudInformation: boolean;
  acceptedTOSVersion: number;
  speedometerConfig: SpeedometerConfig;
  displayAnyNametag: boolean;
  displayOwnNametag: boolean;
  putOnMotobikeHelmet: boolean;
  movementClipset?: string;
  trafficVehiclesRadio: boolean;
  parkedVehicles: boolean;
  savedAnimations: [string, string, string, number][];
  menuSide: 'left' | 'right';
  menuScale: number;
  menuX: number;
  menuY: number;
  menuWidth: number;
  menuMaxElements: number;
  parachuteTintColor: number;
  hitmarker: boolean;
  damageMarker: boolean;
  hitsound: boolean;
  soundsVolume: number;
  menuSounds: boolean;
  bigMinimap: boolean;
  acceptedTOS: boolean;
  killfeed: boolean;
  timeHours: number;
  timeMinutes: number;
  weather: string;
  forceSnow: boolean;
  minimapZoom: number;
  activatedModdedContent: string[];
};

export const defaultConfig: StorageKeys = {
  _version: 1,
  keybinds: DefaultKeybinds,
  uiWatermarkPosition: 0,
  uiShowHudInformation: false,
  acceptedTOSVersion: undefined,
  ambientsound: false,
  speedometerConfig: DefaultSpeedometerConfig,
  displayAnyNametag: true,
  displayOwnNametag: false,
  putOnMotobikeHelmet: true,
  trafficVehiclesRadio: true,
  parkedVehicles: true,
  savedAnimations: new Array(0),
  menuSide: 'left',
  menuScale: 1,
  menuX: 0.5,
  menuY: 1,
  menuWidth: 26,
  menuMaxElements: 16,
  parachuteTintColor: 0,
  hitmarker: true,
  damageMarker: true,
  hitsound: true,
  soundsVolume: 0.05,
  menuSounds: true,
  bigMinimap: false,
  acceptedTOS: false,
  killfeed: true,
  timeHours: 19,
  timeMinutes: 22,
  weather: 'RAIN',
  forceSnow: false,
  minimapZoom: 1100,
  activatedModdedContent: ['GTA5 Remastered Ultimate', 'Forests of San Andreas'],
};

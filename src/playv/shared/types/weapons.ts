export interface WeaponData {
  HashKey: string;
  NameGXT: string;
  DescriptionGXT: string;
  Name: string;
  Description: string;
  Group: string;
  ModelHashKey: string;
  DefaultClipSize: number;
  AmmoType?: string;
  Components: { [key: string]: Component };
  Tints: LiveryColor[];
  LiveryColors: LiveryColor[];
  DLC: string;
}

export interface Component {
  HashKey: string;
  NameGXT: string;
  DescriptionGXT: string;
  Name: string;
  Description: string;
  ModelHashKey: string;
  IsDefault: boolean;
  AmmoType?: string;
}

export interface LiveryColor {
  NameGXT: string;
  Name: string;
}

export type WeaponStats = {
  [weaponId: string | number]: {
    clipSize: number;
    range: number;
    accuracySpread: number;
    animReloadRate: number;
    headshotDamageModifier: number;
    recoilAccuracyMax: number;
    damage: number;
    lockOnRange: number;
    playerDamageModifier: number;
    recoilShakeAmplitude: number;
    recoilAccuracyToAllowHeadshotPlayer: number;
    recoilRecoveryRate: number;
    timeBetweenShots: number;
  };
};

import alt from 'alt-shared';
import { WeaponData, WeaponStats } from '../types/weapons';

export const weaponData: WeaponData[] = JSON.parse(alt.File.read('@assets/dump/weapons.json'));
export const defaultWeaponStats: WeaponStats = JSON.parse(alt.File.read('@assets/dump/defaultWeaponStats.json'));
export const allWeaponHashes = Object.keys(weaponData).map(x => Number(x));
export const readonlyStats = ['modelHash', 'nameHash', 'clipSize', 'timeBetweenShots']; //altv readonly weapon stats

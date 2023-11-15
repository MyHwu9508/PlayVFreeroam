import { checkNoBushes } from './checkNoBushes';
import { checkWeaponStats } from './checkWeaponStats';
import { getSussyKeys, resetSussyKeys } from './sussyKeys';
import alt from 'alt-client';

export function runInitialAnticheatChecks() {
  checkWeaponStats();
  checkNoBushes();
}

export function ac10sTick() {
  const sussyKeys = getSussyKeys();
  if (sussyKeys && Object.keys(sussyKeys).length > 0) {
    alt.emitServerRaw('informServer', 'sussyKeys', JSON.stringify(sussyKeys));
    resetSussyKeys();
  }
}

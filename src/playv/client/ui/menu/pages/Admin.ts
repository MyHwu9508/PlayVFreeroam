import alt from 'alt-client';
import { Page } from '../framework/Page';
import { WeaponStats } from '../../../../shared/types/weapons';
import { weaponData } from '../../../../shared/data/weapons';
import { getClosestVehicle } from '../../../scripts/vehicles';
import { pushToast } from '../../hud/toasts';
import customPeds from '../../../../shared/data/customPeds';
const page = new Page('Admin');

page.addLink('Spieler', '/admin/players');

page.addConfirm('Map WeaponData').onInput(() => {
  mapWeaponData();
});

page.addButton('Nächstes Fahrzeug löschen', 'error').onInput(() => {
  const v = getClosestVehicle();
  if (!v.vehicle?.valid) return;
  if (v.distance > 50) {
    pushToast('warning', 'Kein Fahrzeug in der Nähe gefunden! :(');
    return;
  }
  alt.emitServerRaw('A_DeleteVehByID', v.vehicle.remoteID);
});

page.addSelect('Ped', customPeds).onInput(comp => {
  alt.emitServerRaw('A_ChangePed', comp.value);
});

page.addToggle('Sichtbar', true).onInput(comp => {
  alt.emitServerRaw('A_SetVisible', comp.value);
});

page.addToggle('Anonymisieren', false).onInput(comp => {
  alt.emitServerRaw('A_SetAnonymize', comp.value);
});

page
  .addToggle('Crazy Mazy Nametags', false)
  .onInput(comp => {
    alt.setMeta('crazyMazyNametags', comp.value);
  })
  .addContext('Free ESP mit 500Meter Reichweite und absoluter Präzision');

page.addToggle('Mute Global Chat', alt.getSyncedMeta('isGlobalChatMuted')).onInput(comp => {
  alt.emitServerRaw('A_ToggleGlobalChat', comp.value);
});

function mapWeaponData() {
  logDebug('MAPPING WEAPON DATA');
  const data = {};
  Object.values(weaponData).forEach(weapon => {
    const weaponHash = alt.hash(weapon.HashKey);
    const weaponData = alt.WeaponData.getForHash(weaponHash);
    const weaponDataObj: WeaponStats[] = {
      clipSize: weaponData.clipSize,
      accuracySpread: weaponData.accuracySpread,
      animReloadRate: weaponData.animReloadRate,
      damage: weaponData.damage,
      headshotDamageModifier: weaponData.headshotDamageModifier,
      lockOnRange: weaponData.lockOnRange,
      playerDamageModifier: weaponData.playerDamageModifier,
      range: weaponData.range,
      recoilAccuracyMax: weaponData.recoilAccuracyMax,
      recoilAccuracyToAllowHeadshotPlayer: weaponData.recoilAccuracyToAllowHeadshotPlayer,
      recoilRecoveryRate: weaponData.recoilRecoveryRate,
      recoilShakeAmplitude: weaponData.recoilShakeAmplitude,
      timeBetweenShots: weaponData.timeBetweenShots,
    };
    data[weaponHash] = weaponDataObj;
  });
  alt.logDebug('weaponData: ' + JSON.stringify(data));
}

export default page;

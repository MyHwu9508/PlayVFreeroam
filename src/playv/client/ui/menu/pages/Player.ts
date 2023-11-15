import Clipsets from '../../../../shared/conf/Clipsets';
import { trySetMovementClipset } from '../../../scripts/player/movementClipset';
import { LocalStorage } from '../../../systems/localStorage';
import { Page } from '../framework/Page';
import alt from 'alt-client';
import native from 'natives';
import { Toggle } from '../framework/components/Toggle';
import { getLobbySetting } from '../../../systems/lobby';

let passiveModeComponent: Toggle;
const page = new Page('Player');

page.addLink('Character', '/player/editChar');
page.addLink('Outfit', '/player/editOutfit');
page.addLink('Menyoo', '/player/menyoo');
page.addLink('Animations', '/player/animations');
page.addLink('Scenarios', '/player/scenarios');

page.onBeforeOpen(() => {
  passiveModeComponent.disabled = getLobbySetting('passiveMode') !== 'Normal';
  passiveModeComponent.value = localPlayer.getStreamSyncedMeta('inPassiveMode');
});

passiveModeComponent = page
  .addToggle('Passive Mode')
  .onInput(comp => {
    alt.emitServerRaw('requestSetPassiveMode', comp.value);
  })
  .addContext('Toggle a Passive Mode that helps you enjoying the server without players annoying you. Its somewhat like in GTA:O');

page.addToggle('Put on Motorbike Helmet', LocalStorage.get('putOnMotobikeHelmet')).onInput(comp => {
  native.setPedConfigFlag(localPlayer, 35, comp.value);
  LocalStorage.set('putOnMotobikeHelmet', comp.value);
});

page.addSelect('Movement Style', Object.keys(Clipsets), LocalStorage.get('movementClipset')).onInput(comp => {
  LocalStorage.set('movementClipset', comp.value);
  trySetMovementClipset(comp.value);
});

export default page;

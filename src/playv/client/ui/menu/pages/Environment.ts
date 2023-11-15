import { setAmbientSound } from '../../../scripts/world/ambientSound';
import { LocalStorage } from '../../../systems/localStorage';
import { Page } from '../framework/Page';
import { menu } from '../framework/State';
import Traffic from './Environment/Traffic';
import alt from 'alt-client';
import native from 'natives';

menu.addPage('/environment/traffic', Traffic);

const page = new Page('Environment');
page.addLink('Time & Weather', '/environment/timeandweather');
page.addLink('Traffic', '/environment/traffic');
page
  .addLink('Modded Content', '/environment/moddedcontent')
  .addContext('Toggle Modded Content such as extended tree maps, custom MLOs and more. Disabling modded content will improve performance!');
page.addLink('Interiors', '/environment/interiors');
page.addLink('IPLs', '/environment/ipls');

page.addToggle('Blackout', false).onInput(comp => {
  native.setArtificialLightsState(comp.value);
});
page.addToggle('Disable Emissive Lights', false).onInput(comp => {
  alt.setConfigFlag('DISABLE_EMISSIVE_LIGHTS_RENDERING', comp.value);
});

page.addToggle('Ambient Sound', LocalStorage.get('ambientsound')).onInput(comp => {
  LocalStorage.set('ambientsound', comp.value);
  setAmbientSound(comp.value);
});
export default page;

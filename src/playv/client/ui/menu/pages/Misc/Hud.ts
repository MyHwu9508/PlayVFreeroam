import { LocalStorage } from '../../../../systems/localStorage';
import { changeVolume } from '../../../hud/sounds';
import { Page } from '../../framework/Page';
import native from 'natives';

const page = new Page('Hud');

page
  .addSlider('Hud Volume', 0, 1, 0.01, LocalStorage.get('soundsVolume'))
  .onInput(comp => {
    changeVolume(comp.value);
  })
  .addContext('Change the volume of the hud sounds such as hitmarker, notifications and more...');

page.addToggle('Hitmarker', LocalStorage.get('hitmarker')).onInput(comp => {
  LocalStorage.set('hitmarker', comp.value);
});

page.addToggle('Damage Marker', LocalStorage.get('damageMarker')).onInput(comp => {
  LocalStorage.set('damageMarker', comp.value);
});

page.addToggle('Killfeed', LocalStorage.get('killfeed')).onInput(comp => {
  LocalStorage.set('killfeed', comp.value);
});

page.addToggle('Large Minimap', LocalStorage.get('bigMinimap')).onInput(comp => {
  LocalStorage.set('bigMinimap', comp.value);
  native.setBigmapActive(comp.value, false);
});

page
  .addToggle('Hud Details', LocalStorage.get('uiShowHudInformation'))
  .onInput(comp => {
    LocalStorage.set('uiShowHudInformation', comp.value);
  })
  .addContext('Show more details on the hud such as the current stree, vehicle names on entering etc...');

page.addToggle('Show Any Nametag', LocalStorage.get('displayAnyNametag')).onInput(comp => {
  LocalStorage.set('displayAnyNametag', comp.value);
});

page.addToggle('Show Own Nametag', LocalStorage.get('displayOwnNametag')).onInput(comp => {
  LocalStorage.set('displayOwnNametag', comp.value);
});

page.addNumberSelect('Minimap Zoom',0,1400,100,LocalStorage.get('minimapZoom')).onInput(comp => {
  LocalStorage.set('minimapZoom', comp.value);
  native.setRadarZoom(comp.value);
});

export default page;

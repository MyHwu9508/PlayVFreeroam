import { LocalStorage } from '../../../systems/localStorage';
import { Page } from '../framework/Page';
import native from 'natives';
import alt from 'alt-client';
import { menuState } from '../framework/State';

const page = new Page('Misc');
page.addLink('Speedometer', '/misc/speedometer').addContext('Change the speedometer settings (design, km/h to mph, positioning and more)');
page.addLink('Keybinds', '/misc/keybinds').addContext('Change the keybinds of the menu and other features');
page.addLink('Theme', '/misc/theme').addContext('Change the theme of the menu & hud');
page.addLink('Menu', '/misc/MenuSettings').addContext('Change the menu settings (position, width, scale, max elements and more)');
page.addLink('Hud', '/misc/hud').addContext('Change the hud settings (hitmarker, damage marker, volume and more)');

page.addLink('Debug', '/misc/debug').addContext('Debugging tools for developers');

page.addButton('Change Username').onInput(() => {
  menuState.setVisibility(false);
  alt.emitServerRaw('requestUsernameWindow');
});

page.addNumberSelect('Parachute Tint', 0, 8, 1, LocalStorage.get('parachuteTintColor')).onInput(comp => {
  LocalStorage.set('parachuteTintColor', comp.value);
});

page
  .addButton('Clear Decals')
  .onInput(() => {
    native.removeDecalsInRange(localPlayer.pos.x, localPlayer.pos.y, localPlayer.pos.z, 5000);
  })
  .addContext('Clears all decals such as blood, bullet holes and more');
export default page;

import alt from 'alt-client';
import { Page } from '../framework/Page';
import { pushToast } from '../../hud/toasts';
import { openURL } from '../../hud/misc';
import { menuState } from '../framework/State';
import { Button } from '../framework/components/Button';

alt.onServer('setDiscordButtonVisible', setDiscordButtonVisible);

export const Homepage = new Page('Welcome on PlayV.mp ❤️');
buildHomePage();

const discordButtonComp = new Button('💾 Discord')
  .addContext('Your account is not linked with Discord! Use this option to backup or restore data connected with your Discord account!')
  .onInput(async () => {
    const url = (await alt.emitRpc('getDiscordAuthUrl')) as string;
    if (!url) {
      pushToast('error', 'An error occured!');
      return;
    }
    alt.log('LOGIN URL: ' + url);
    openURL(url);
  });

export function addAdminLink() {
  Homepage.addLink('🐒 Admin', '/admin');
}

function setDiscordButtonVisible(state: boolean) {
  if (state) {
    Homepage.addComponent(discordButtonComp);
  } else {
    Homepage.removeComponentById(discordButtonComp.id);
  }
}

function buildHomePage() {
  logDebug('Building Homepage');
  // Homepage.removeComponentsAfter(-1);
  if (alt.debug) Homepage.addLink('TEST', '/test');
  Homepage.addLink('🚗 Vehicle', '/vehicle');
  Homepage.addLink('🧑 Player', '/player');
  Homepage.addLink('🔫 Weapon', '/weapon');
  Homepage.addLink('🌳 Environment', '/environment');
  Homepage.addLink('🌐 Lobby', '/lobby');
  Homepage.addLink('🔧 Misc', '/misc');
  // if (menuState.currentPath === '/' && menuState.isVisible) menuState.setComponentIndex(1);
  // else Homepage.lastIndex == 1;
}

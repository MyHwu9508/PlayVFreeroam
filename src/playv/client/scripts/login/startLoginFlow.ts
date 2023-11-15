import alt from 'alt-client';
import native from 'natives';
import { LocalStorage } from '../../systems/localStorage';
import { ConVar } from '../../../shared/conf/ConVars';
import { playIntro } from './playIntro';
import { openRegisterWindow } from '../../ui/hud/login/registerWindow';
import { hideHelpWindows } from '../../ui/hud/login/discordLoginHelper';
import { pushToast } from '../../ui/hud/toasts';
import { runInitialAnticheatChecks } from '../../systems/anticheat/manager';
import { ChatMessage } from '../../../shared/types/types';
import { pushChatMessage } from '../../ui/hud/chat';
import { updateKillFeedAnchors } from '../../ui/hud/killfeed';

alt.onServer('startLoginFlow', hideHelpWindows);
alt.onServer('endLoginFlow', endLoginFlow);

export async function startLoginFlow() {
  native.setEntityAlpha(localPlayer, 0, false);
  log('login', 'Starting Login Flow');
  const userIsRegistered = LocalStorage.get('acceptedTOSVersion') === ConVar.LOGIN.CURRENT_TOS_VERSION && LocalStorage.get('acceptedTOS');
  logDebug('User is registered: ' + userIsRegistered);
  logDebug('User accepted TOS: ' + LocalStorage.get('acceptedTOS'));
  logDebug('User accepted TOS Version: ' + LocalStorage.get('acceptedTOSVersion'));
  if (ConVar.DEBUG.FAST_LOGIN) {
    alt.setMeta('introCompleted', true);
    endLoginFlow();
    native.doScreenFadeIn(0);
    return;
  }
  if (!userIsRegistered) {
    await registration();
    login();
  } else {
    login();
  }
}

async function registration() {
  alt.logDebug('User is not registered, opening register window');
  // await playIntro();
  native.doScreenFadeIn(100);
  await openRegisterWindow();
  logDebug('User accepted TOS');
  LocalStorage.set('acceptedTOSVersion', ConVar.LOGIN.CURRENT_TOS_VERSION);
  LocalStorage.set('acceptedTOS', true);
}

async function login() {
  if (!alt.hasMeta('introCompleted')) playIntro();
  alt.emitServerRaw('pleaseLogin');
}

async function endLoginFlow() {
  alt.logDebug('Login Flow ended');
  updateKillFeedAnchors();
  native.resetEntityAlpha(localPlayer);
  // alt.setMeta('showHud', true);
  // stopLoginScene();
  runInitialAnticheatChecks();

  if (native.getProfileSetting(750) != 0) {
    pushToast(
      'warning',
      'Use the raw input mouse method, otherwise you will experience issues using the server menus! Go into the GTA5 Settings and change the Input type in mouse/keyboard settings'
    );
  }

  await alt.Utils.wait(5000);
  const message: ChatMessage = {
    range: 'Near',
    username: 'PlayV',
    text: `Hey ${localPlayer.getStreamSyncedMeta(
      'username'
    )}, welcome to PlayV and enjoy your stay! If you have any questions, feel free to ask in the chat or on our Discord PlayV.mp/discord!`,
    tagColor: '#c81976',
  };
  pushChatMessage(message);
}

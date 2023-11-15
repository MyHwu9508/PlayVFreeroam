import alt from 'alt-client';
import { pushToast } from './toasts';
import { setUsernameWindowOpen } from './usernameWindow';
import { setFloatingButtons } from './floatingKeybinds';
import { initSpeedometer } from './speedometer';
import { initChat } from './chat';
import { registerMiscHudEvents } from './misc';
import { registerKillfeed } from './killfeed';

alt.onServer('pushToast', pushToast);
alt.onServer('setUsernameWindowOpen', setUsernameWindowOpen);
alt.onServer('setFloatingKeybinds', setFloatingButtons);
initSpeedometer();
initChat();
registerMiscHudEvents();
registerKillfeed();

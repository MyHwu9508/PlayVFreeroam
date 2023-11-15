import alt from 'alt-client';
import native from 'natives';
import { keybindManager } from '../systems/keybinds';
import { permissions } from '../systems/access/permissions';
import { cancelHeal } from './healkeys';
import { setHudState } from '../ui/hud/misc';

// E Key for various stuff like interactions

keybindManager.registerEvent(
  'keybind.interaction',
  () => {
    if (permissions.getStateActive('healing')) {
      cancelHeal();
    }
    if (alt.getLocalMeta('lobbyInvite')) {
      logDebug('requestJoinLobby ', alt.getLocalMeta('lobbyInvite'));
      alt.emitRpc('requestJoinLobby', alt.getLocalMeta('lobbyInvite'));
    }
  },
  'keydown'
);

keybindManager.registerEvent('keybind.interaction', () => {}, 'keyup');

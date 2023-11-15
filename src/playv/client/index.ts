import alt from 'alt-client';
import './utils/logger'; //import to register logging functions in globalThis scope

import { runStartupScript } from './scripts/startup';
import { startLoginFlow } from './scripts/login/startLoginFlow';

//Events
import './events/everyTick';
import './events/streamSyncedMetaChange';
import './events/localMetaChange';
import './events/every100ms';
import './events/every10s';
import './events/every5s';
import './events/gameEntityCreate';
import './events/gameEntityDestroy';
import './events/netownerChange';
import './events/consoleCommand';
import './events/playerWeaponShoot';
import './events/windowResolutionChange';

//UI
import './ui/view/onReady';
import './ui/hud/register';
import './ui/charEditor/register';
import './ui/menu/register';
// import './ui/hud/wheelmenu/wheelRegister';

//Proto
import './proto/vehicle';
import './proto/player';
import '../shared/proto/vector';
import '../shared/proto/entity';

import './scripts/world/weather';
import './scripts/world/time';
import './utils/tests';
import './scripts/vehicles/misc';
import './scripts/voice';
import './scripts/vehicles';
import './scripts/freecam';
import './scripts/noclip';
import './scripts/player/respawn';
import './scripts/weapons';
import './scripts/parachute';
import './scripts/hitmarker';
import './scripts/interactionKey';
import './scripts/healkeys';
import './systems/anticheat/manager';
import './scripts/spawnarea/musicBox';
import './events/entityHitEntity';

import './systems/parkedVehicles';

alt.on('connectionComplete', startupPlayV);

async function startupPlayV() {
  // alt.LocalStorage.clear();
  try {
    alt.Utils.waitFor(() => alt.Player.local.isSpawned, 999999999); // wait until localplayers is spawned
    await runStartupScript(); //init world, values and stuff
    await alt.Utils.waitFor(() => alt.getMeta('webViewReady'), 999999999); // wait until our ui is happy
    //menu builden vor login
    await startLoginFlow(); //actually starts with the login flow...
  } catch (e) {
    alt.logError('Error while loading client side ' + e);
  }
}

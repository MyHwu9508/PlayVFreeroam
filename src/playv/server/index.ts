import './events/playerConnect';
import './events/playerDisconnect';
import './events/explosion';
import './events/playerWeaponChange';
import './events/playerDeath';
import './events/startFire';
import './events/startProjectile';
import './events/vehicleDestroy';
import './events/vehicleHorn';
import './events/weaponDamage';
import './events/playerLeftVehicle';
import './events/playerEnteredVehicle';
import './events/requestSyncedScene';
import './events/clientRequestObject';
import './events/clientDeleteObject';

import './systems/consoleCommands';
import './systems/pedsync/manager';

import './scripts/vehicles/playerCommands';
import './scripts/vehicles/customVehicles';
import './scripts/vehicles/moddedVehicles';
import './scripts/settingMetas';

import './systems/lobby/presets';

import './scripts/passiveMode';
import './scripts/animations';
import './scripts/healkeys';
import './scripts/anticheat';

import './scripts/characters/register';
import './scripts/blips';

import './scripts/admin/playerCommands';
import './scripts/login/discordURL';
import './scripts/spawnArea';
import './scripts/chat';
import './systems/lobby/playerCommands';

import './proto/player';
import '../shared/proto/vector';
import './proto/vehicle';
import '../shared/proto/entity';

import './scripts/weather';
import './scripts/voice';

import './scripts/login/loginFlow';

import './systems/webServer/index';

import './utils/tests';
import { startReconnectWatcher } from './utils/reconnect';

startReconnectWatcher();

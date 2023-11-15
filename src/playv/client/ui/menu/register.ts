import alt from 'alt-client';
import { keybindManager } from '../../systems/keybinds';
import { menu, menuState } from './framework/State';
import { Homepage, addAdminLink } from './pages/Homepage';
import { page as Test } from './pages/Test';
import { page as Vehicle } from './pages/Vehicle';
import { page as VehicleSpawner } from './pages/Vehicle/Spawner';
import { registerVehicleManager } from './pages/Vehicle/manageVehicle/VehiclePageManager';
import Admin from './pages/Admin';
import Player from './pages/Player';
import EditChar from './pages/Player/EditChar';
import EditOutfit from './pages/Player/EditOutfit';
import Environment from './pages/Environment';
import Menyoo from './pages/Player/Menyoo';
import Players from './pages/Admin/Players';
import Manage from './pages/Admin/Manage';
import Lobby from './pages/Lobby';
import ManageLobby from './pages/Lobby/Manage';
import CreateLobby from './pages/Lobby/Create';
import Misc from './pages/Misc';
import Speedometer from './pages/Misc/Speedometer';
import Theme from './pages/Misc/Theme';
import Keybinds from './pages/Misc/Keybinds';
import Animations from './pages/Player/Animations';
import Scenarios from './pages/Player/Scenarios';
import IPLS from './pages/Environment/IPLS';
import MenuSettings from './pages/Misc/MenuSettings';
import Weapon from './pages/Weapon';
import Hud from './pages/Misc/Hud';
import Interiors from './pages/Environment/Interiors';
import TimeAndWeather from './pages/Environment/TimeAndWeather';
import ModdedContent from './pages/Environment/ModdedContent';
import Debug from './pages/Misc/Debug';

alt.onServer('allowAdminPage', allowAdminPage);

menu.addPage('/', Homepage);
if (alt.debug) menu.addPage('/test', Test);
//Vehicle
menu.addPage('/vehicle', Vehicle);
menu.addPage('/vehicle/spawner', VehicleSpawner);
//Player
menu.addPage('/player', Player);
menu.addPage('/player/editChar', EditChar);
menu.addPage('/player/editOutfit', EditOutfit);
menu.addPage('/player/menyoo', Menyoo);
menu.addPage('/player/animations', Animations);
menu.addPage('/player/scenarios', Scenarios);

menu.addPage('/environment', Environment);
menu.addPage('/environment/timeandweather', TimeAndWeather);
menu.addPage('/environment/ipls', IPLS);
menu.addPage('/environment/interiors', Interiors);
menu.addPage('/environment/moddedcontent', ModdedContent);

//lobby
menu.addPage('/lobby', Lobby);
menu.addPage('/lobby/manage', ManageLobby);
menu.addPage('/lobby/create', CreateLobby);
//misc
menu.addPage('/misc', Misc);
menu.addPage('/misc/speedometer', Speedometer);
menu.addPage('/misc/theme', Theme);
menu.addPage('/misc/keybinds', Keybinds);
menu.addPage('/misc/MenuSettings', MenuSettings);
menu.addPage('/misc/hud', Hud);
menu.addPage('/misc/debug', Debug);

menu.addPage('/weapon', Weapon);

menuState.setPath('/');

//TODO make menu toggle with natives > Controller DPAD UP Support
keybindManager.registerEvent('keybind.mainMenu', () => {
  menuState.setVisibility(!menuState.isVisible);
});

function allowAdminPage() {
  logDebug('allowAdminPage');
  addAdminLink();
  menu.addPage('/admin', Admin);
  menu.addPage('/admin/players', Players);
  menu.addPage('/admin/players/manage', Manage);
}

registerVehicleManager();

import type alttype from 'alt-server';
import alt from 'alt-shared';
import type { LobbyPreset } from '../../server/entities/lobbyPreset';

export type LobbySettings = {
  weaponDmgMult: number;
  headshot: boolean; //headshot/critical damage
  nametagDrawDistance: number;
  runningSpeed: number;
  superjump: boolean;
  canFlyThruWindscreen: boolean;
  traffic_enabled: boolean;
  traffic_density: number; //min dist between vehicles, heavily affects population
  respawnAt: (typeof RespawnOptions)[number];
  respawnOption: number | undefined;
  respawnTimeout: number;
  blips: boolean;
  respawnHealth: number;
  respawnArmour: number;
  passiveMode: (typeof PassiveModeOptions)[number];
  vehicleSlipStreaming: boolean;
  healduration: number;
  spawnProtection: number;
  meleeCriticalHits: boolean;
  healAfterKill: boolean;
  melee: boolean;

  syncTimeOption: (typeof SyncOptions)[number];
  syncWeatherOption: (typeof SyncOptions)[number];
  timeHours: number;
  timeMinutes: number;
  weather: string;
};

export const defaultLobbySettings: LobbySettings = {
  weaponDmgMult: 0.4,
  headshot: false,
  nametagDrawDistance: 100,
  runningSpeed: 1.19,
  superjump: false,
  canFlyThruWindscreen: true,
  traffic_enabled: true,
  traffic_density: 30,
  respawnAt: 'Random Around',
  respawnOption: 75,
  respawnTimeout: 5000,
  blips: true,
  respawnHealth: 100,
  respawnArmour: 100,
  passiveMode: 'Normal',
  vehicleSlipStreaming: false,
  timeHours: 19,
  timeMinutes: 22,
  weather: 'RAIN',
  healduration: 4000,
  spawnProtection: 3000,
  meleeCriticalHits: false,
  healAfterKill: false,
  melee: true,
  syncTimeOption: 'Server',
  syncWeatherOption: 'Server',
};

export const defaultLobbyPermissions = ['vehicle.nitro', 'ui.*', 'freecam', 'noclip', 'vehicle.tuning', 'parachute.use', 'healkeys.use', 'vehicle.godmode', 'vehicle.spawn'];
export type Lobby = {
  settings: LobbySettings;
  permissions: string[];
  name: string;
  owner: alttype.Player;
  players: alttype.Player[];
  dimension: number;
  description: string;
  allowedWeapons: number[];
  public: boolean;
};

export type LobbyPresetPreview = {
  name: string;
  description: string;
  ownerID: number;
  passiveMode: string;
  headshot: boolean;
  weaponDmgMult: number;
  traffic_enabled: boolean;
  allowedWeaponsCount: number;
  id: number;
  numUsed: number;
  username?: string;
  noclip: boolean;
};
export type LobbyPresetWithOwner = LobbyPreset & { username: string };

export const RespawnOptions = ['On Death Position', 'Random Around', 'Positions'] as const;
export const PassiveModeOptions = ['Force Off', 'Normal', 'Force On'] as const;
export const SyncOptions = ['Server', 'Lobby', 'Off'] as const;
export const defaultAllowedWeapons = [
  0xf7f1e25e, 0xaf113f99, 0x22d8fe39, 0xbfefff6d, 0x394f415c, 0xe284c527, 0xefe7e2df, 0x12e82d3d, 0x23c9f95c, 0x958a4a8f, 0xcd274149, 0x6d5e2801, 0xf9e6aa4b, 0x7f229f94,
  0x84d6fafd, 0x9d61e50f, 0x6589186a, 0x83bf0278, 0xfad1f1c9, 0x2b5ef5ec, 0x7fd62962, 0xdbbd7280, 0xa3d4d34, 0x5ef9fec4, 0x5a96ba4, 0x781fe4a, 0x624fe830, 0x84bd7bfd, 0x92a27487,
  0xef951fbb, 0x97ea20b8, 0xdb26713a, 0x184140a1, 0x60ec506, 0x7f7497e5, 0x8bb05fd7, 0x57a4368c, 0xe232c28c, 0x440e4788, 0x93e220bd, 0xa284510b, 0x61012683, 0x4e875f73, 0xd04c944d,
  0xf9dcbf2d, 0xba536372, 0xd205520e, 0xc78d71b4, 0x3aabbbaa, 0xc472fe2, 0xa914799, 0x63ab0442, 0x99b507ea, 0xd8df3c3c, 0xdd5df8d9, 0xdb1aa450, 0xdc4db296, 0xc734385a, 0x6a6c02e0,
  0x9d07f764, 0x13532244, 0x9d1f17e6, 0xbd248b55, 0x24b17070, 0xa89cb99e, 0x917f6c8c, 0x678b81b1, 0x34a67b97, 0xba45e8b8, 0x1b06d571, 0xbfe256d4, 0x99aeeb3b, 0x1bc4fdb9,
  0x94117305, 0x6e7dddec, 0xab564b93, 0x1d073a89, 0x555af99a, 0x6d544c99, 0xfea23564, 0x476bf155, 0xc1b3c3d1, 0xcb96392f, 0xb1ca77b1, 0x7846a318, 0x2be6766b, 0x78a97cd0,
  0xfdbc8a50, 0x5fc3c11, 0x787f0bb, 0xbfd21232, 0x88374054, 0xc0a3098d, 0x969c3d67, 0x2c3731d9, 0x3813fc08, 0x3656c8c1, 0xdfe37640, 0xd1d5f52b, 0x14e5afd5, 0x83839c4, 0x19044ee0,
];

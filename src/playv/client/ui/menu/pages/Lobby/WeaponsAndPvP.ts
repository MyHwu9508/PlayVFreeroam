import { allWeaponHashes, weaponData } from '../../../../../shared/data/weapons';
import { LobbySettings, PassiveModeOptions, RespawnOptions } from '../../../../../shared/types/lobby';
import { Page } from '../../framework/Page';
import alt from 'alt-client';
import { menu } from '../../framework/State';
import { Toggle } from '../../framework/components/Toggle';
import { spawnPositions } from '../../../../../shared/data/spawnPositions';
import { NumberSelect } from '../../framework/components/NumberSelect';

const page = new Page('Weapons & PvP');
let lobbySettings: LobbySettings;
let lobbyPermissions: string[];
let respawnOptionComponent: NumberSelect;

page.onBeforeOpen(async () => {
  page.removeComponentsAfter(-1);
  await generateContent();
});

async function generateContent() {
  lobbySettings = (await alt.emitRpc('getLobbySettings')) as LobbySettings;
  lobbyPermissions = (await alt.emitRpc('getLobbyPermissions')) as string[];

  page.addLink('Manage Weapons', '/lobby/manage/weapons/manageweapons').addContext('Manage the weapons for the lobby.');

  page
    .addNumberSelect('Weapon Damage Multiplier', 0.1, 10, 0.1, lobbySettings.weaponDmgMult)
    .onInput(async comp => {
      const res = await alt.emitRpc('setLobbySetting', 'weaponDmgMult', Number(comp.value));
    })
    .addContext('This is the multiplier for weapon damage. 1 means normal damage, 0.5 means half damage, 2 means double damage, etc.')
    .addThrottle(200);
  page
    .addToggle('Headshots', lobbySettings.headshot)
    .onInput(async comp => {
      const res = await alt.emitRpc('setLobbySetting', 'headshot', comp.value);
    })
    .addContext('This will enable/disable headshot/critical damage. If disabled a headshots will do the same damage as a bodyshot.')
    .addThrottle(200);

  page
    .addToggle('Allow Melee', lobbySettings.melee)
    .onInput(async comp => {
      const res = await alt.emitRpc('setLobbySetting', 'melee', comp.value);
    })
    .addContext('This will enable/disable melee hits.')
    .addThrottle(200);

  page
    .addToggle('Allow Critical Melee Hits', lobbySettings.meleeCriticalHits)
    .onInput(async comp => {
      const res = await alt.emitRpc('setLobbySetting', 'meleeCriticalHits', comp.value);
    })
    .addContext('This will enable/disable critical melee hits with normal weapons. (alson known as one hit attack/ instant kill)')
    .addThrottle(200);

  page.addButton('').addConfig({ line: true, lineColor: 'primary' });

  page
    .addSelect('Passive Mode', PassiveModeOptions as unknown as Array<string>, lobbySettings.passiveMode)
    .onInput(async comp => {
      const res = await alt.emitRpc('setLobbySetting', 'passiveMode', comp.value);
    })
    .addContext(
      'This will enable/disable passive mode. If enabled you will not be able to shoot other players and they will not be able to shoot you. Normal means players can decide if they want to be in passive mode or not.'
    )
    .addThrottle(2000);

  page
    .addToggle('Heal After Kill', lobbySettings.healAfterKill)
    .onInput(async comp => {
      const res = await alt.emitRpc('setLobbySetting', 'healAfterKill', comp.value);
    })
    .addContext('This will enable/disable healing after a kill. The player will receive the HP and Armor from the Respawn Options')
    .addThrottle(200);

  page
    .addNumberSelect('Spawn Protection', 0, 10, 0.5, lobbySettings.spawnProtection / 1000)
    .onInput(async comp => {
      const res = await alt.emitRpc('setLobbySetting', 'spawnProtection', Number(comp.value * 1000));
    })
    .addContext('This is the time in seconds that players have spawn protection.')
    .addThrottle(200);

  page
    .addNumberSelect('Respawn HP', 1, 100, 1, lobbySettings.respawnHealth)
    .onInput(async comp => {
      const res = await alt.emitRpc('setLobbySetting', 'respawnHealth', Number(comp.value));
    })
    .addContext('This is the amount of HP you will respawn with.')
    .addThrottle(200);

  page
    .addNumberSelect('Respawn Armor', 0, 100, 1, lobbySettings.respawnArmour)
    .onInput(async comp => {
      const res = await alt.emitRpc('setLobbySetting', 'respawnArmour', Number(comp.value));
    })
    .addContext('This is the amount of armor you will respawn with.')
    .addThrottle(200);

  page
    .addNumberSelect('Respawn Timeout', 0, 60, 1, Math.round(lobbySettings.respawnTimeout / 1000))
    .onInput(async comp => {
      const res = await alt.emitRpc('setLobbySetting', 'respawnTimeout', Number(comp.value * 1000));
    })
    .addContext('This is the time in seconds that you have to wait before you can respawn.')
    .addThrottle(200);

  respawnOptionComponent = page
    .addNumberSelect('Respawn Option', 0, 1, 1, lobbySettings.respawnOption)
    .onInput(async comp => {
      const res = await alt.emitRpc('setLobbySetting', 'respawnOption', Number(comp.value));
    })
    .addThrottle(200)
    .addContext(
      'Respawn Option is combined with Respawn At. When using Positions you choose from different spawn positions for FFA and when using Random Around youll choose the meters around!'
    );

  page
    .addSelect('Respawn At', RespawnOptions as unknown as Array<string>, lobbySettings.respawnAt)
    .onInput(async comp => {
      const res = await alt.emitRpc('setLobbySetting', 'respawnAt', comp.value);
      if (comp.value === 'Positions') {
        await alt.emitRpc('setLobbySetting', 'respawnOption', 0);
      }
      // respawnOptionComponent.value = 0;
      updateRespawnComponent();
    })
    .addContext('Select where you want to respawn. Positions means a random position from predifined spawn positions. To change the spawn positions also use the slider above!!!')
    .addThrottle(200);

  page
    .addToggle('Allow Healkeys', lobbyPermissions.includes('healkeys.use'))
    .onInput(async comp => {
      const res = await alt.emitRpc('setLobbyPermission', 'healkeys.use', comp.value);
    })
    .addContext('This will enable/disable the healkeys. If enabled you can use the healkeys (by default , and .) to heal yourself.')
    .addThrottle(200);

  page
    .addNumberSelect('Heal Duration', 0, 10, 0.5, lobbySettings.healduration / 1000)
    .onInput(async comp => {
      const res = await alt.emitRpc('setLobbySetting', 'healduration', Number(comp.value * 1000));
    })
    .addContext('How long the healkeys (, and . ) will take. Players can cancel healing by pressing the interaction key (e)')
    .addThrottle(200);

  updateRespawnComponent();
  updatePageContents(false);
  menu.addPage('/lobby/manage/weapons/manageweapons', await generateAllowedWeaponsPage());
}

async function updateRespawnComponent() {
  lobbySettings = (await alt.emitRpc('getLobbySettings')) as LobbySettings;
  lobbyPermissions = (await alt.emitRpc('getLobbyPermissions')) as string[];
  respawnOptionComponent.disabled = lobbySettings.respawnAt === 'On Death Position';
  if (lobbySettings.respawnAt === 'Random Around') {
    respawnOptionComponent.max = 100;
  } else if (lobbySettings.respawnAt === 'Positions') {
    respawnOptionComponent.max = Object.keys(spawnPositions).length - 1;
  }
  respawnOptionComponent.value = lobbySettings.respawnOption;
}

const weaponComponents = new Map<number, Toggle>();
async function updatePageContents(updateData = true) {
  if (!lobbySettings) return;
  if (updateData) {
    lobbySettings = (await alt.emitRpc('getLobbySettings')) as LobbySettings;
    lobbyPermissions = (await alt.emitRpc('getLobbyPermissions')) as string[];
  }
}

async function generateAllowedWeaponsPage() {
  const wpage = new Page('Allowed Weapons');
  const allowedWeapons = (await alt.emitRpc('getLobbyAllowedWeapons')) as number[];

  wpage.addOverlay('Allowed Weapons', ['Allow All', 'Remove All']).onInput(async comp => {
    const res = await alt.emitRpc('setLobbyAllowedWeaponsBulk', comp.value === 'Allow All');
    weaponComponents.forEach((value, key, map) => {
      value.value = comp.value === 'Allow All';
    });
    updatePageContents();
  });

  const sortedWeaponData = Object.values(weaponData).sort((a, b) => {
    return a.Name.localeCompare(b.Name);
  });
  Object.values(sortedWeaponData).forEach(weapon => {
    const toggle = wpage.addToggle(weapon.Name, allowedWeapons.includes(alt.hash(weapon.HashKey))).onInput(async comp => {
      const res = await alt.emitRpc('toggleLobbyAllowedWeapon', alt.hash(weapon.HashKey), comp.value);
    });
    weaponComponents.set(alt.hash(weapon.HashKey), toggle);
  });
  return wpage;
}

export default page;

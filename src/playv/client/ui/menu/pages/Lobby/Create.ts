import alt from 'alt-client';
import { Page } from '../../framework/Page';
import { ConVar } from '../../../../../shared/conf/ConVars';
import { menu, menuState } from '../../framework/State';
import { LobbyPresetPreview } from '../../../../../shared/types/lobby';

const page = new Page('Create Lobby');
const presetPage = new Page('Community Presets');
const myPresetPage = new Page('My Presets');
menu.addPage('/lobby/create/preset', presetPage);
menu.addPage('/lobby/create/mypreset', myPresetPage);

const name = page.addInput('Name', '', ConVar.LOBBY.MAX_NAME_LENGTH);
const description = page.addInput('Description', '', ConVar.LOBBY.MAX_DESCRIPTION_LENGTH);
page.addConfirm('Create Lobby').onInput(async () => {
  const res = await alt.emitRpc('tryCreateLobby', name.value, description.value);
  logDebug('tryCreateLobby', res);
  if (res) menuState.setPath('/lobby/manage');
});
page.addButton('').addConfig({ line: true, lineColor: 'primary' });
page.addLink('My Presets', '/lobby/create/mypreset');
page.addLink('Community Presets', '/lobby/create/preset');

presetPage.onBeforeOpen(() => {
  presetPage.removeComponentsAfter(-1);
  generatePresetContent();
});

async function generatePresetContent() {
  const presets = (await alt.emitRpc('playerRequestLobbyPresets')) as LobbyPresetPreview[];
  presets.sort((a, b) => b.numUsed - a.numUsed);
  if (!presets) return;
  presets.forEach(preset => {
    presetPage
      .addButton(preset.name)
      .onInput(async () => {
        const res = await alt.emitRpc('tryCreateLobbyFromPreset', preset.id);
        if (res) menuState.setPath('/lobby/manage');
      })
      .addContext(getPresetContext(preset));
  });
}

myPresetPage.onBeforeOpen(async () => {
  myPresetPage.removeComponentsAfter(-1);
  await generateMyPresetsContent();
});

async function generateMyPresetsContent() {
  const presets = (await alt.emitRpc('playerRequestMyLobbyPresets')) as LobbyPresetPreview[];
  if (!presets) return;
  presets.forEach(preset => {
    myPresetPage
      .addOverlay(preset.name, ['Create Lobby', 'Delete'])
      .onInput(async comp => {
        if (comp.value === 'Delete') {
          const resdelete = alt.emitRpc('tryDeleteLobbyPreset', preset.id);
          if (resdelete)
            alt.setTimeout(() => {
              myPresetPage.removeComponentById(comp.id);
            }, 200);
          return;
        }
        const res = await alt.emitRpc('tryCreateLobbyFromPreset', preset.id);
        if (res) menuState.setPath('/lobby/manage');
      })
      .addContext(getPresetContext(preset));
  });
}

function getPresetContext(preset: LobbyPresetPreview) {
  let context = '<div style="display:grid; grid-template-columns:1fr 1fr; text-align:start;">';
  context += `<span style="color:rgb(var(--color-primary-300));">Description</span> ${preset.description}<br>`;
  context += `<span style="color:rgb(var(--color-primary-300));">Creator</span> ${preset.username}<br>`;
  context += `<span style="color:rgb(var(--color-primary-300));">Times Used</span> ${preset.numUsed}<br>`;
  context += `<span style="color:rgb(var(--color-primary-300));">Headshot On</span> ${preset.headshot}<br>`;
  context += `<span style="color:rgb(var(--color-primary-300));">Traffic On</span> ${preset.traffic_enabled}<br>`;
  context += `<span style="color:rgb(var(--color-primary-300));">Noclip On</span> ${preset.noclip}<br>`;
  context += `<span style="color:rgb(var(--color-primary-300));">Weapon Dmg</span> ${preset.weaponDmgMult}<br>`;
  context += `<span style="color:rgb(var(--color-primary-300));">Num Allowed Weapons</span> ${preset.allowedWeaponsCount}<br>`;
  context += `<span style="color:rgb(var(--color-primary-300));">Passive Mode</span> ${preset.passiveMode}<br>`;
  context += '</div>';
  return context;
}

export default page;

import { Page } from '../../framework/Page';
import alt from 'alt-client';
import native from 'natives';
import { moddedContent } from '../../../../scripts/world/ipls';
import { LocalStorage } from '../../../../systems/localStorage';

const page = new Page('Modded Content');

for (const [name, content] of Object.entries(moddedContent)) {
  page
    .addToggle(name, LocalStorage.get('activatedModdedContent').includes(name))
    .onInput(comp => {
      toggleModdedContent(name, comp.value);
    })
    .addContext(getModdedContentContext(content));
}
export default page;

function getModdedContentContext(content) {
  let context = '<div style="display:grid; grid-template-columns:1fr 1fr; text-align:start;">';
  context += `<span style="color:rgb(var(--color-primary-300));">Author</span> ${content.Creator}<br>`;
  context += `<span style="color:rgb(var(--color-primary-300));">URL</span> ${content.URL}<br>`;
  context += `<span style="color:rgb(var(--color-primary-300));">Description</span> ${content.Description}<br>`;
  context += '</div>';
  return context;
}

function toggleModdedContent(name: string, value: boolean) {
  if (value) {
    for (const ipl of moddedContent[name].IPLs) {
      native.requestIpl(ipl);
    }
  } else {
    for (const ipl of moddedContent[name].IPLs) {
      native.removeIpl(ipl);
    }
  }

  let activatedModdedContent = LocalStorage.get('activatedModdedContent');
  if (value && !activatedModdedContent.includes(name)) {
    activatedModdedContent.push(name);
  } else if (!value && activatedModdedContent.includes(name)) {
    activatedModdedContent = activatedModdedContent.filter(x => x !== name);
  }
  LocalStorage.set('activatedModdedContent', activatedModdedContent);
}

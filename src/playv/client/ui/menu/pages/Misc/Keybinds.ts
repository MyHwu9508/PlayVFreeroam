import DefaultKeybinds, { debugKeys, keyNames } from '../../../../../shared/conf/DefaultKeybinds';
import { Page } from '../../framework/Page';
import alt from 'alt-client';

const page = new Page('Keybinds');

for (const key of Object.keys(keyNames)) {
  if (debugKeys.includes(key) && !alt.debug) continue;
  page.addKeybindButton(keyNames[key as keyof typeof keyNames], key as keyof typeof DefaultKeybinds);
}

export default page;

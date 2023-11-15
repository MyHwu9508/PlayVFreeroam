import { getXMLFromCharacter } from '../../../../scripts/menyoo/exportMenyoo';
import { getCharacterFromXML } from '../../../../scripts/menyoo/importMenyoo';
import { showTextArea } from '../../framework/Modals';
import { Page } from '../../framework/Page';
import alt from 'alt-client';

const page = new Page('Menyoo');
page.addButton('Export current Character & Outfit to Menyoo').onInput(() => {
  const character = alt.getLocalMeta('currentCharacterData');
  const outfit = alt.getLocalMeta('currentOutfitData');
  const xml = getXMLFromCharacter(character, outfit);
  if (!xml) return;
  showTextArea('Menyoo export', xml);
});
page.addButton('Import from Menyoo').onInput(async () => {
  const res = (await showTextArea('Menyoo import', '', true)) as string;
  if (!res) return;
  const [character, outfit] = getCharacterFromXML(res);
  alt.emitServer('importCharacter', character, outfit);
});

export default page;

import { ConVar } from '../../../../../shared/conf/ConVars';
import { emitPromiseServer } from '../../../../utils/promiseEvents';
import { pushToast } from '../../../hud/toasts';
import { Page } from '../../framework/Page';
import alt from 'alt-client';

const page = new Page('Character');
let charList: [number, string][] = [];
page
  .addOverlay('Select Character')
  .onBeforeActive(async comp => {
    charList = await emitPromiseServer('getSavedCharacters');
    comp.inputs = charList.map(char => {
      return [char[1], alt.getLocalMeta('currentCharacter') === char[0]];
    });
  })
  .onInput(comp => {
    const char = charList[comp.currentIndex];
    if (!char) return;
    if (localPlayer.isInCombat()) {
      pushToast('warning', `You are in combat! Wait ${Math.round(ConVar.RESTRICTIONS.LAST_COMBAT / 1000)}s seconds after your last combat action to change your character!`);
      return;
    }
    alt.emitServer('selectCharacter', char[0]);
    comp.active = false;
  });
const nameInput = page.addInput('Name').onFinished((comp, confirm) => {
  if (confirm) alt.emitServer('renameCharacter', alt.getLocalMeta('currentCharacter'), comp.value);
});
page.addButton('Start Character Editor').onInput(() => {
  alt.emitServer('startCharEditor');
});
page.addConfirm('Randomize Character').onInput(() => {
  alt.emitServer('randomizeCurrentCharacter');
});
page.addConfirm('Delete Character', 'Are you sure?', 'error').onInput(() => {
  alt.emitServer('deleteCharacter', alt.getLocalMeta('currentCharacter'));
});
page.addInput('Duplicate Character').onFinished((comp, confirm) => {
  if (confirm) alt.emitServer('duplicateCharacter', alt.getLocalMeta('currentCharacter'), comp.value);
  comp.value = '';
});
page.addInput('Create new Character').onFinished((comp, confirm) => {
  if (confirm) alt.emitServer('createCharacter', comp.value);
  comp.value = '';
});

page.onOpen(() => {
  nameInput.value = alt.getLocalMeta('currentCharacterName');
});
alt.on('localMetaChange', (key, value) => {
  if (key === 'currentCharacterName') {
    nameInput.value = value;
  }
});

export default page;

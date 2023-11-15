import alt from 'alt-client';
import { AdminListData } from '../../../../../shared/types/types';
import { Page } from '../../framework/Page';
import { menuState } from '../../framework/State';

const page = new Page('Spieler Managen');

export function generatePageContent(data: AdminListData) {
  page.removeComponentsAfter(-1);
  page.title = data.name;
  page.addOverlay('Schlaue Sachen', ['TP zum Spieler', 'TP Spieler zu mir']).onInput(comp => {
    if (comp.selected) {
      alt.emitServerRaw('A_Action', comp.value as string, data.gameID);
    }
  });

  ['Verwarnen', 'Kick', 'Mute', 'Unmute', 'Perma Ban'].forEach(action => {
    page.addInput(action).onFinished((comp, confirm) => {
      if (!confirm) return;
      alt.emitServerRaw('A_Action', action, data.gameID, comp.value);
    });
  });

  page.addButton('');
  const banTimes = ['1 Tag', '3 Tage', '7 Tage', '14 Tage', '30 Tage', '90 Tage', '180 Tage', '365 Tage'];
  const tempbantime = page.addSelect('Temp Ban Zeit', banTimes).onInput(comp => {});
  page.addInput('Temp Ban').onFinished((comp, confirm) => {
    if (!confirm) return;
    const timeinMS = parseInt(banTimes.find(x => x === tempbantime.value)?.split(' ')[0] || '0') * 24 * 60 * 60 * 1000;
    alt.emitServerRaw('A_Action', 'Temp Ban', data.gameID, comp.value, timeinMS);
  });
  menuState.setComponentIndex(0, 0);
}

export default page;

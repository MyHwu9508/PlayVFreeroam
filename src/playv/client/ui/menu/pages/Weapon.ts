import alt from 'alt-client';
import { Page } from '../framework/Page';

const page = new Page('Weapons');
page.addButton('Refill Weapons').onInput(() => {
  alt.emitServerRaw('requestRefillWeapons');
});
export default page;

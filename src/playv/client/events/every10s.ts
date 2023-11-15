import alt from 'alt-client';
import { ac10sTick } from '../systems/anticheat/manager';

alt.setInterval(() => {
  runInterval();
}, 10 * 1000);

function runInterval() {
  ac10sTick();
}

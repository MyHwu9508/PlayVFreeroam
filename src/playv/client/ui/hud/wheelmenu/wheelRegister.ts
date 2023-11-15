import alt from 'alt-client';
import { keybindManager } from '../../../systems/keybinds';
import { wheels } from './wheelFramework';
import defaultWheel from './default';

keybindManager.registerEvent('keybind.wheelmenu', openWheelMenu);
wheels.set('default', defaultWheel);

function openWheelMenu() {
  console.log('opening wheel menu');
  const wheel = wheels.get('default');
  alt.emit('wheel:showMenu', wheel.getForWebView());
}

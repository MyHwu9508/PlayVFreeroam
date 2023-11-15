import { LocalStorage } from '../../../../systems/localStorage';
import { resetSpeedometerConfig, updateSpeedometerConfig } from '../../../hud/speedometer';
import { Page } from '../../framework/Page';
import alt from 'alt-client';

const page = new Page('Speedometer');
const speedometerDesigns: [string, number][] = [
  ['Forza 5 Digital', 0],
  ['Forza 4 Digital', 1],
  ['NFS 2015', 2],
  ['Text', 3],
  ['Binary', 4],
  ['None', -1],
];
const speedometerModes: [string, number][] = [
  ['KMH', 0],
  ['MPH', 1],
];
let config = LocalStorage.get('speedometerConfig');

page
  .addSelect(
    'Design',
    speedometerDesigns.map(design => design[0]),
    speedometerDesigns.find(design => design[1] === config.speedoMeterType)[0]
  )
  .onInput(comp => {
    updateSpeedometerConfig('speedoMeterType', speedometerDesigns.find(design => design[0] === comp.value)[1]);
  });

page
  .addSelect(
    'Mode',
    speedometerModes.map(mode => mode[0]),
    speedometerModes.find(mode => mode[1] === config.mode)[0]
  )
  .onInput(comp => {
    updateSpeedometerConfig('mode', speedometerModes.find(mode => mode[0] === comp.value)[1]);
  });

page.addNumberSelect('Width', 0, 100, 0.1, config.width).onInput(comp => {
  updateSpeedometerConfig('width', comp.value);
});

page.addNumberSelect('Distance From Bottom', 0, 100, 0.1, config.bottom).onInput(comp => {
  updateSpeedometerConfig('bottom', comp.value);
});

page.addNumberSelect('Distance From Right', 0, 100, 0.1, config.right).onInput(comp => {
  updateSpeedometerConfig('right', comp.value);
});

page.addConfirm('Reset', 'Are you sure you want to reset the speedometer settings?').onInput(() => {
  resetSpeedometerConfig();
});

export default page;

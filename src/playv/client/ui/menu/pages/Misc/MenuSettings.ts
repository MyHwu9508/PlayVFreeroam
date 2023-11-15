import { defaultConfig } from '../../../../../shared/conf/StorageKeys';
import { LocalStorage } from '../../../../systems/localStorage';
import { Page } from '../../framework/Page';
import { menuState } from '../../framework/State';

const page = new Page('Menu');

const maxElem = page.addNumberSelect('Max displayed Elements', 6, 24, 1, LocalStorage.get('menuMaxElements')).onInput(comp => {
  LocalStorage.set('menuMaxElements', comp.value);
  updateMenuSettings();
});
const side = page.addSelect('Side', ['Left', 'Right'], LocalStorage.get('menuSide')).onInput(comp => {
  LocalStorage.set('menuSide', comp.value);
  updateMenuSettings();
});
const posX = page
  .addSlider('Position x', 0, 80, 0.25, LocalStorage.get('menuX'))
  .onInput(comp => {
    LocalStorage.set('menuX', comp.value);
    updateMenuSettings();
    comp.generateContext();
  })
  .generateContext();
const posY = page
  .addSlider('Position y', 0, 80, 0.25, LocalStorage.get('menuY'))
  .onInput(comp => {
    LocalStorage.set('menuY', comp.value);
    updateMenuSettings();
    comp.generateContext();
  })
  .generateContext();
const width = page
  .addSlider('Width', 16, 42, 1, LocalStorage.get('menuWidth'))
  .onInput(comp => {
    LocalStorage.set('menuWidth', comp.value);
    updateMenuSettings();
    comp.generateContext(0);
  })
  .generateContext(0);
const scale = page
  .addSlider('Scale', 0.5, 2, 0.05, LocalStorage.get('menuScale'))
  .onInput(comp => {
    LocalStorage.set('menuScale', comp.value);
    updateMenuSettings();
    comp.generateContext();
  })
  .generateContext();

page.addToggle('Navigation Sounds', LocalStorage.get('menuSounds')).onInput(comp => {
  LocalStorage.set('menuSounds', comp.value);
});

page.addButton('Reset').onInput(resetMenuSettings);

export function updateMenuSettings() {
  menuState.applySettings(String(side.value).toLowerCase() as never, maxElem.value, posX.value, posY.value, width.value, scale.value);
}

export function resetMenuSettings() {
  maxElem.value = defaultConfig.menuMaxElements;
  side.value = defaultConfig.menuSide === 'left' ? 'Left' : 'Right';
  posX.value = defaultConfig.menuX;
  posX.generateContext();
  posY.value = defaultConfig.menuY;
  posY.generateContext();
  width.value = defaultConfig.menuWidth;
  width.generateContext();
  scale.value = defaultConfig.menuScale;
  scale.generateContext();
  updateMenuSettings();
  LocalStorage.set('menuMaxElements', defaultConfig.menuMaxElements);
  LocalStorage.set('menuSide', defaultConfig.menuSide);
  LocalStorage.set('menuX', defaultConfig.menuX);
  LocalStorage.set('menuY', defaultConfig.menuY);
  LocalStorage.set('menuWidth', defaultConfig.menuWidth);
  LocalStorage.set('menuScale', defaultConfig.menuScale);
}

export default page;

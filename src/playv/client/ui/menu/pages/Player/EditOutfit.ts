import alt from 'alt-client';
import native from 'natives';
import { Page } from '../../framework/Page';
import type { NumberSelect } from '../../framework/components/NumberSelect';
import { propIndex, variationIndex } from '../../../../../shared/types/outfits';
import { workingDecals } from '../../../../../shared/data/workingDecals';

const page = new Page('Outfit');

let outfitList: [number, string][] = [];
page
  .addOverlay('Select Outfit')
  .onBeforeActive(async comp => {
    try {
      const res = await alt.emitRpc('getSavedOutfits');
      outfitList = res as [number, string][];
      comp.inputs = outfitList.map(char => {
        return [char[1], alt.getLocalMeta('currentOutfit') === char[0]];
      });
    } catch (err) {
      console.error('Error getting outfits', err);
    }
  })
  .onInput(comp => {
    const outfit = outfitList[comp.currentIndex];
    if (!outfit) return;
    alt.emitServer('selectOutfit', outfit[0]);
    comp.active = false;
  });

const nameInput = page.addInput('Name').onFinished((comp, confirm) => {
  if (confirm) alt.emitServer('renameOutfit', alt.getLocalMeta('currentOutfit'), comp.value); //TODO
});

page.addConfirm('Randomize Outfit').onInput(() => {
  alt.emitServer('randomizeCurrentOutfit'); //TODO
});

page.addConfirm('Delete Outfit', 'Are you sure?', 'error').onInput(() => {
  alt.emitServer('deleteOutfit', alt.getLocalMeta('currentOutfit'));
});

page.addInput('Duplicate Outfit').onFinished((comp, confirm) => {
  if (confirm) alt.emitServer('duplicateOutfit', alt.getLocalMeta('currentOutfit'), comp.value); //TODO
  comp.value = '';
});

page.addInput('Create new Outfit').onFinished((comp, confirm) => {
  if (confirm) alt.emitServer('createOutfit', comp.value);
  comp.value = '';
});

const itemSelectors: Record<string, NumberSelect> = {};
const texturesSelectors: Record<string, NumberSelect> = {};
const clothes = {
  mask: 'Mask',
  torso: 'Torso',
  legs: 'Legs',
  armor: 'Armor',
  bags: 'Bags',
  shoes: 'Shoes',
  undershirt: 'Undershirt',
  accessories: 'Accessories',
  decals: 'Decals',
  shirts: 'Shirts',
  hats: 'Hats',
  glasses: 'Glasses',
  ears: 'Ears',
  watches: 'Watches',
  bracelets: 'Bracelets',
};
for (const [key, cloth] of Object.entries(clothes)) {
  const item = (itemSelectors[key] = page.addNumberSelect(cloth, key in propIndex ? -1 : 0, 213, 1, 0));
  const texture = (texturesSelectors[key] = page.addNumberSelect(cloth + ' Texture', 0, 100, 1, 0));

  item
    .onInput(comp => {
      if (key in variationIndex) {
        native.setPedComponentVariation(localPlayer, variationIndex[key], 0, 0, 0);
      } else {
        native.clearPedProp(localPlayer, propIndex[key], 0);
      }
      if (key === 'decals') {
        const decal = workingDecals.includes(comp.value);
        if (!decal) return;
      }
      alt.emitServer('changeCloth', key, comp.value, 0);
    })
    .addThrottle(100);
  texture
    .onInput(comp => {
      alt.emitServer('changeCloth', key, item.value, comp.value);
    })
    .addThrottle(100);
}

page.onOpen(() => {
  nameInput.value = alt.getLocalMeta('currentOutfitName');
  setMaxValues();
});

alt.on('localMetaChange', (key, value) => {
  //TODO refactor using /client/events/localMetaChange.ts
  if (key === 'currentOutfitName') {
    nameInput.value = value;
  } else if (key === 'currentOutfitData') {
    for (const [key, index] of Object.entries(value as Record<string, [number, number]>)) {
      if (!itemSelectors[key].selected) itemSelectors[key].value = index[0];
      let max = 0;
      if (key in variationIndex) {
        max = native.getNumberOfPedTextureVariations(localPlayer, Number(variationIndex[key]), Number(index[0])) - 1;
      } else {
        max = native.getNumberOfPedPropTextureVariations(localPlayer, Number(propIndex[key]), Number(index[0])) - 1;
      }
      texturesSelectors[key].max = max;
      if (!texturesSelectors[key].selected) texturesSelectors[key].value = index[1];
    }
  }
});

function setMaxValues() {
  for (const key of Object.keys(clothes)) {
    if (key in variationIndex) {
      const index = variationIndex[key];
      itemSelectors[key].max = native.getNumberOfPedDrawableVariations(localPlayer, index) - 1;
      texturesSelectors[key].max = native.getNumberOfPedTextureVariations(localPlayer, Number(index), Number(itemSelectors[key].value)) - 1;
    } else {
      const index = propIndex[key];
      if (!index) continue;
      itemSelectors[key].max = native.getNumberOfPedPropDrawableVariations(localPlayer, index) - 1;
      texturesSelectors[key].max = native.getNumberOfPedPropTextureVariations(localPlayer, Number(index), Number(itemSelectors[key].value)) - 1;
    }
  }
}

export default page;

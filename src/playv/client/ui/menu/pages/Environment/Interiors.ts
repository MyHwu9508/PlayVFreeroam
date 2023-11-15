import { Page } from '../../framework/Page';
import alt from 'alt-client';
import { menu } from '../../framework/State';
import native from 'natives';
import { teleport } from '../../../../scripts/player/teleport';

type Position = {
  x: string;
  y: string;
  z: string;
};

type Interior = {
  names: string[];
  file: string;
  pos: Position;
};
const selectorOptions = ['Disabled', 'Tint 0', 'Tint 1', 'Tint 2', 'Tint 3', 'Tint 4', 'Tint 5', 'Tint 6', 'Tint 7', 'Tint 8', 'Tint 9'];
const allInteriors: Interior[] = JSON.parse(alt.File.read('@assets/dump/intEntSets.json'));

const page = new Page('Interiors');

for (const [interiorName, interior] of Object.entries(allInteriors)) {
  if (!interior.pos) {
    logDebug(`Interior ${interiorName} has no position, skipping...`);
    continue;
  }
  page.addLink(interiorName, '/environment/interiors/' + interiorName);
  const iPage = new Page(interiorName);
  menu.addPage('/environment/interiors/' + interiorName, iPage);

  iPage.addButton('Teleport').onInput(() => {
    teleport(new alt.Vector3(parseFloat(interior.pos.x), parseFloat(interior.pos.y), parseFloat(interior.pos.z)));
  });

  const interiorID = native.getInteriorAtCoords(parseFloat(interior.pos.x), parseFloat(interior.pos.y), parseFloat(interior.pos.z));
  for (const entitySet of interior.names) {
    const overlay = iPage.addSelect(entitySet, selectorOptions, native.isInteriorEntitySetActive(interiorID, entitySet) ? 'Tint 0' : 'Disabled');
    overlay.onInput(comp => {
      if (comp.value === 'Disabled') {
        native.deactivateInteriorEntitySet(interiorID, entitySet);
      } else {
        native.activateInteriorEntitySet(interiorID, entitySet);
        native.setInteriorEntitySetTintIndex(interiorID, entitySet, Number(comp.value[0].substring(5)));
      }
      native.refreshInterior(interiorID);
    });
  }
}

export default page;

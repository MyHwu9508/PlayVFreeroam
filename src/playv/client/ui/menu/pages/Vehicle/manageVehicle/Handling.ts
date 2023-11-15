import alt from 'alt-client';
import native from 'natives';
import { Page } from '../../../framework/Page';
import handlingOptions, { damageFlags, handlingFlags, modelFlags } from '../../../../../../shared/data/handlingOptions';
import { generateFlagIndexArray, generateFlagValueFromIndeces } from '../../../../../../shared/utils/binFlags';

const flags = {
  modelFlags: modelFlags,
  handlingFlags: handlingFlags,
  damageFlags: damageFlags,
};

export function createHandlingPage(vehicle: alt.Vehicle) {
  const page = new Page('Handling');

  page.addConfirm('Reset', 'Are you sure ?').onInput(() => {
    vehicle.handling.reset();
  });

  for (let option of handlingOptions) {
    switch (option.type) {
      case 'number':
        page
          .addNumberSelect(option.key, option.min, option.max, option.step, Math.round(vehicle.handling[option.key] * 1000) / 1000)
          .onInput(comp => {
            vehicle.handling[option.key] = comp.value;
          })
          .addContext(option.hint);
        break;
      case 'divider':
        page.addButton(option.hint).addConfig({ line: true, lineColor: 'primary' });
        break;
      case 'vector3':
        for (const axis of ['x', 'y', 'z']) {
          page
            .addNumberSelect(`${option.key}${axis.toUpperCase()}`, option.min, option.max, option.step, Math.round(vehicle.handling[option.key][axis] * 1000) / 1000)
            .onInput(comp => {
              vehicle.handling[option.key] = new alt.Vector3(
                axis === 'x' ? comp.value : vehicle.handling[option.key].x,
                axis === 'y' ? comp.value : vehicle.handling[option.key].y,
                axis === 'z' ? comp.value : vehicle.handling[option.key].z
              );
            })
            .addContext(option.hint);
        }
        break;
      case 'flags':
        {
          const flagArray = flags[option.key];
          const selectors = [];
          const selectedFlags = generateFlagIndexArray(vehicle.handling[option.key]);
          for (let i = 0; i < flagArray.length; i++) {
            selectors.push([flagArray[i], selectedFlags.includes(i)]);
          }
          const overlay = page.addOverlay(option.key).onInput(comp => {
            const flags = generateFlagValueFromIndeces(comp.inputs.filter(x => x[1] === true));
            vehicle.handling[option.key] = flags;
          });
          overlay.inputs = selectors;
        }

        break;
      case 'readonly':
        page.addButton(`${option.key}: ${vehicle.handling[option.key]}`).addContext(option.hint || '');
        break;
    }
  }

  return page;
}

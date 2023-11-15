import alt from 'alt-client';
import native from 'natives';
import { Page } from '../../../framework/Page';
import { ConVar } from '../../../../../../shared/conf/ConVars';
import handlingOptions from '../../../../../../shared/data/handlingOptions';
import { VehicleHandling } from '../../../../../../shared/types/vehicleHandling';
import _ from 'lodash';

export function createSavePage(vehicle: alt.Vehicle) {
  const page = new Page('Save');

  let savepublic = false;
  let name = vehicle.getMeta('displayName');
  page
    .addToggle('Public', false, 'checkbox')
    .addContext('Public means your Vehicle will be visible for everyone and listed in the community vehicle section.')
    .onInput(comp => {
      savepublic = comp.value;
    });

  page.addInput('Savename', name, ConVar.ALL.MAX_SAVENAME_LENGTH).onInput(comp => {
    name = comp.value;
  });

  page.addButton('Save', 'success').onInput(comp => {
    //send to server for storing in db, also send reset to not store modified values
    const keys = handlingOptions.map(x => {
      if (x.key !== '_') return x.key;
      return null;
    });

    const saveHandlingData: VehicleHandling = _.pick(vehicle.handling, keys) as VehicleHandling;
    const handling = vehicle.handling.isModified() ? saveHandlingData : null;
    alt.emitServerRaw('saveCustomVehicle', vehicle.remoteID, name, savepublic, handling);
  });

  return page;
}

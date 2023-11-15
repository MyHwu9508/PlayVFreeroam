import alt from 'alt-client';
import { getCommunityVehicles, getModdedVehicles, getSavedVehicleData } from '../../../../scripts/vehicles';
import { Page } from '../../framework/Page';
import vehicles, { vehicleData } from '../../../../../shared/data/vehicles';
import type { BaseComponent } from '../../framework/components/BaseComponent';
import { Button } from '../../framework/components/Button';
import { compareString } from '../../../../../shared/utils/string';
import { PageLink } from '../../framework/components/PageLink';
import _ from 'lodash';
import { menu, menuState } from '../../framework/State';
import { Theme } from '../../../../systems/themeChanger';
import { colord } from 'colord';
import { CommunityVehicle } from '../../../../../shared/types/types';
import native from 'natives';
import { pushToast } from '../../../hud/toasts';
import { getFreeVehicleSpawn } from '../../../../scripts/spawnarea/getFreeVehicleSpawn';

let menuBuilt = false;

const sortedAllVehicles = Object.values(vehicles).sort((a, b) => compareString(a.DisplayName.English ?? '', b.DisplayName.English ?? ''));
menu.addPage('/vehicle/spawner/saved', buildSavedPage());
menu.addPage('/vehicle/spawner/modded', buildModdedPage());
menu.addPage('/vehicle/spawner/community', buildCommunityPage());

export const page = new Page('Vehicle Spawner');
page
  .addInput('Spawn by Name...')
  .onFinished((comp, confirm) => {
    if (!confirm) return;
    if (native.getEntityHeightAboveGround(localPlayer) > 2 && alt.getLocalMeta('isInSpawnProtectArea')) return pushToast('warning', 'You cannot spawn a vehicle while in the air!');
    if (native.isModelValid(alt.hash(comp.value)) === false) {
      comp.value = '';
      return pushToast('error', 'That vehicle does not exist!');
    }
    spawnVehicleByModelname(comp.value);
    comp.value = '';
  })
  .addContext('Enter the hashname of the vehicle you want to spawn For example raiden or jugular');

page.onBeforeOpen(async () => {
  if (menuBuilt) return;
  buildVanillaComponents();
  menuBuilt = true;
});

page.addLink('Saved', '/vehicle/spawner/saved');
page.addLink('Modded', '/vehicle/spawner/modded');
page.addLink('Community', '/vehicle/spawner/community');

page.addButton('').addConfig({ line: true, color: 'primary' });

const vanillaTypeSelector = page.addSelect('Vanilla Vehicles', ['All', 'By Class', 'By Manufacturer', 'By Type', 'By DLC']).onInput(() => {
  buildVanillaComponents();
});

export function refreshSavedVehiclePage() {
  menu.removePage('/vehicle/spawner/saved');
  menu.addPage('/vehicle/spawner/saved', buildSavedPage());
}

function buildSavedPage() {
  const nPage = new Page('Saved Vehicles');
  nPage.onBeforeOpen(async () => {
    nPage.removeComponentsAfter(-1);
    const savedVehicles = await getSavedVehicleData();
    for (const veh of savedVehicles) {
      nPage
        .addOverlay(veh[1], ['Spawn', 'Delete'])
        .onInput(comp => {
          if (comp.value === 'Spawn') {
            spawnVehicleByCustomID(veh[0], veh[2]);
          } else if (comp.value === 'Delete') {
            alt.emitServer('deleteCustomVehicle', veh[0]);
          }
        })
        .addContext(getSavedVehicleContext(veh));
    }
  });
  return nPage;
}

function buildModdedPage() {
  let nPageBuilt = false;
  const nPage = new Page('Modded Vehicles');

  nPage.onOpen(async () => {
    if (nPageBuilt) return;
    const moddedVehicles = await getModdedVehicles();
    for (const veh of moddedVehicles) {
      nPage
        .addButton(veh[0])
        .addContext(getVehModdedContext(veh))
        .onInput(() => {
          spawnVehicleByModelname(veh[1]);
        });
    }
    nPageBuilt = true;
  });

  return nPage;
}

function buildCommunityPage() {
  const nPage = new Page('Community Vehicles');
  nPage.onBeforeOpen(async () => {
    nPage.removeComponentsAfter(-1);
    const communityVehicles = await getCommunityVehicles();
    for (const veh of communityVehicles) {
      nPage
        .addButton(veh[1])
        .addContext(getCommunityVehicleContext(veh))
        .onInput(() => {
          spawnVehicleByCustomID(veh[0], veh[2]);
        });
    }
  });
  return nPage;
}

export function buildVanillaComponents() {
  page.removeComponentsAfterById(vanillaTypeSelector.id);
  const components: BaseComponent[] = [];
  switch (vanillaTypeSelector.value) {
    case 'All':
      {
        for (const v of sortedAllVehicles) {
          if (!v.DisplayName?.English) v.DisplayName.English = v.Name;
          const comp = new Button(v.DisplayName.English).onInput(() => {
            spawnVehicleByModelname(v.Name);
          });
          comp.context = getVanillaVehicleContext(v);
          components.push(comp);
        }
      }
      break;
    case 'By Class':
      {
        const classMap = new Map<string, vehicleData[]>();
        for (const v of sortedAllVehicles) {
          if (!v.Class) continue;
          if (!classMap.has(v.Class)) classMap.set(v.Class, []);
          classMap.get(v.Class).push(v);
        }
        for (const c of classMap.keys()) {
          const categoryName = _.capitalize(c);
          const comp = new PageLink(categoryName, '/vehicle/spawner/class/' + c);
          components.push(comp);

          if (menu.hasPage(comp.href)) continue;
          const classPage = new Page(c);
          for (const v of classMap.get(c)) {
            const vehicleSpawnName = v.DisplayName?.English ?? v.Name;
            const comp = new Button(vehicleSpawnName).onInput(() => {
              spawnVehicleByModelname(v.Name);
            });
            comp.context = getVanillaVehicleContext(v);
            classPage.addComponent(comp);
          }
          menu.addPage('/vehicle/spawner/class/' + c, classPage);
        }
      }
      break;

    case 'By Manufacturer':
      {
        const manufacturerMap = new Map<string, vehicleData[]>();
        for (const v of sortedAllVehicles) {
          if (!v.ManufacturerDisplayName?.English) continue;
          if (!manufacturerMap.has(v.ManufacturerDisplayName.English)) manufacturerMap.set(v.ManufacturerDisplayName.English, []);
          manufacturerMap.get(v.ManufacturerDisplayName.English).push(v);
        }
        for (const m of manufacturerMap.keys()) {
          const categoryName = _.capitalize(m);
          const comp = new PageLink(categoryName, '/vehicle/spawner/manufacturer/' + m);
          components.push(comp);

          if (menu.hasPage(comp.href)) continue;
          const manufacturerPage = new Page(m);
          for (const v of manufacturerMap.get(m)) {
            const vehicleSpawnName = v.DisplayName?.English ?? v.Name;
            const comp = new Button(vehicleSpawnName).onInput(() => {
              spawnVehicleByModelname(v.Name);
            });
            comp.context = getVanillaVehicleContext(v);
            manufacturerPage.addComponent(comp);
          }
          menu.addPage('/vehicle/spawner/manufacturer/' + m, manufacturerPage);
        }
      }
      break;

    case 'By Type':
      {
        const typeMap = new Map<string, vehicleData[]>();
        for (const v of sortedAllVehicles) {
          if (!v.Type) continue;
          if (!typeMap.has(v.Type)) typeMap.set(v.Type, []);
          typeMap.get(v.Type).push(v);
        }
        for (const t of typeMap.keys()) {
          const categoryName = _.capitalize(t);
          const comp = new PageLink(categoryName, '/vehicle/spawner/type/' + t);
          components.push(comp);

          if (menu.hasPage(comp.href)) continue;
          const typePage = new Page(t);
          for (const v of typeMap.get(t)) {
            const vehicleSpawnName = v.DisplayName?.English ?? v.Name;
            const comp = new Button(vehicleSpawnName).onInput(() => {
              spawnVehicleByModelname(v.Name);
            });
            comp.context = getVanillaVehicleContext(v);
            typePage.addComponent(comp);
          }
          menu.addPage('/vehicle/spawner/type/' + t, typePage);
        }
      }
      break;
    case 'By DLC':
      {
        const dlcMap = new Map<string, vehicleData[]>();
        for (const v of sortedAllVehicles) {
          if (!v.DlcName) continue;
          if (!dlcMap.has(v.DlcName)) dlcMap.set(v.DlcName, []);
          dlcMap.get(v.DlcName).push(v);
        }
        for (const d of dlcMap.keys()) {
          const categoryName = _.capitalize(d);
          const comp = new PageLink(categoryName, '/vehicle/spawner/dlc/' + d);
          components.push(comp);

          if (menu.hasPage(comp.href)) continue;
          const dlcPage = new Page(d);
          for (const v of dlcMap.get(d)) {
            const vehicleSpawnName = v.DisplayName?.English ?? v.Name;
            const comp = new Button(vehicleSpawnName).onInput(() => {
              spawnVehicleByModelname(v.Name);
            });
            comp.context = getVanillaVehicleContext(v);
            dlcPage.addComponent(comp);
          }
          menu.addPage('/vehicle/spawner/dlc/' + d, dlcPage);
        }
      }
      break;
  }
  page.addComponents(...components);
}

function getCommunityVehicleContext(data: CommunityVehicle) {
  let context = '<div style="display:grid; grid-template-columns:1fr 1fr; text-align:start;">';
  context += `<span style="color:rgb(var(--color-primary-300));">ID</span> ${data[0]}<br>`;
  context += `<span style="color:rgb(var(--color-primary-300));">Name</span> ${data[1]}<br>`;
  context += `<span style="color:rgb(var(--color-primary-300));">Vehicle Model</span> ${data[2]}<br>`;
  context += `<span style="color:rgb(var(--color-primary-300));">Author</span> ${data[3]}<br>`;
  context += '</div>';
  return context;
}

function getVehModdedContext(data: [string, string, string, string]) {
  let context = '<div style="display:grid; grid-template-columns:1fr 1fr; text-align:start;">';
  context += `<span style="color:rgb(var(--color-primary-300));">Name</span> ${data[0]}<br>`;
  context += `<span style="color:rgb(var(--color-primary-300));">Vehicle Model</span> ${data[1]}<br>`;
  context += `<span style="color:rgb(var(--color-primary-300));">Author</span> ${data[2]}<br>`;
  context += `<span style="color:rgb(var(--color-primary-300));">Source</span> ${data[3]}<br>`;
  context += '</div>';
  return context;
}

function getSavedVehicleContext(data: [number, string, string, boolean]) {
  let context = '<div style="display:grid; grid-template-columns:1fr 1fr; text-align:start;">';
  context += `<span style="color:rgb(var(--color-primary-300));">ID</span> ${data[0]}<br>`;
  context += `<span style="color:rgb(var(--color-primary-300));">Name</span> ${data[1]}<br>`;
  context += `<span style="color:rgb(var(--color-primary-300));">Vehicle Model</span> ${data[2]}<br>`;
  context += `<span style="color:rgb(var(--color-primary-300));">Public</span> ${data[3]}<br>`;
  context += '</div>';
  return context;
}

function getVanillaVehicleContext(vehicle: vehicleData) {
  let context = '<div style="display:grid; grid-template-columns:1fr 1fr; text-align:start;">';
  if (vehicle.DisplayName?.English) context += `<span style="color:rgb(var(--color-primary-300));">Name</span> ${vehicle.DisplayName.English}<br>`;
  if (vehicle.Name) context += `<span style="color:rgb(var(--color-primary-300));">Vehicle Model</span> ${vehicle.Name}<br>`;
  if (vehicle.ManufacturerDisplayName?.English) context += `<span style="color:rgb(var(--color-primary-300));">Manufacturer</span> ${vehicle.ManufacturerDisplayName.English}<br>`;
  if (vehicle.Class) context += `<span style="color:rgb(var(--color-primary-300));">Class</span> ${_.capitalize(vehicle.Class)}<br>`;
  if (vehicle.Type) context += `<span style="color:rgb(var(--color-primary-300));">Type</span> ${_.capitalize(vehicle.Type)}<br>`;
  if (vehicle.DlcName) context += `<span style="color:rgb(var(--color-primary-300));">DLC</span> ${vehicle.DlcName}<br>`;
  if (vehicle.MaxSpeed) context += `<span style="color:rgb(var(--color-primary-300));">Estimated Max Speed</span> ${Math.max(vehicle.MaxSpeed * 3.7, 0).toFixed(0)}km/h<br>`;
  if (vehicle.Seats) context += `<span style="color:rgb(var(--color-primary-300));">Seats</span> ${vehicle.Seats}<br>`;
  context += '</div>';
  return context;
}

function spawnVehicleByModelname(modelName: string) {
  const canSpawnVehicle = canSpawnVehicleCheck(modelName);
  if (canSpawnVehicle !== true) return;

  if (native.getEntityHeightAboveGround(localPlayer) > 2 && alt.getLocalMeta('isInSpawnProtectArea')) return pushToast('warning', 'You cannot spawn a vehicle while in the air!');
  const location = getFreeVehicleSpawn(modelName) ?? [localPlayer.inFront(5), localPlayer.rot];
  alt.emitServer(
    'requestModelSpawnVehicle',
    modelName,
    location,
    new alt.RGBA(colord(Theme.primary ?? '#000000').toRgb()),
    new alt.RGBA(colord(Theme.secondary ?? '#000000').toRgb())
  );
}

function spawnVehicleByCustomID(id: number, modelName: string) {
  const canSpawnVehicle = canSpawnVehicleCheck(modelName);
  if (canSpawnVehicle !== true) return;

  if (native.getEntityHeightAboveGround(localPlayer) > 2 && alt.getLocalMeta('isInSpawnProtectArea')) return pushToast('warning', 'You cannot spawn a vehicle while in the air!');
  const location = getFreeVehicleSpawn(modelName) ?? [localPlayer.inFront(5), localPlayer.rot];
  alt.emitServer('requestSpawnCustomVehicle', id, location);
}

function canSpawnVehicleCheck(modelName: string) {
  if (!native.isModelValid(alt.hash(modelName))) return pushToast('warning', 'That vehicle does not exist!');
  const [, minDim, maxDim] = native.getModelDimensions(alt.hash(modelName));
  if ((maxDim.y >= 6 || minDim.y <= -6 || maxDim.x >= 6 || minDim.x <= -6) && alt.getLocalMeta('isInSpawnProtectArea'))
    return pushToast('warning', 'You cannot spawn a vehicle that large in the spawn area, please leave the spawn area first!');
  return true;
}

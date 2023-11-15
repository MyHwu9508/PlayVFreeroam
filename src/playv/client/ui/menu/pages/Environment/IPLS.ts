import { loadDefaultIPLs } from '../../../../scripts/world/ipls';
import { Page } from '../../framework/Page';
import alt from 'alt-client';
import native from 'natives';
import { menu } from '../../framework/State';
import { Overlay } from '../../framework/components/Overlay';
import { teleport } from '../../../../scripts/player/teleport';

export interface IPLGroup {
  Name: string;
  DlcName: string;
  Position: DimensionMax;
  DimensionMin: DimensionMax;
  DimensionMax: DimensionMax;
  ContentFlags: number;
  ExtraData: ExtraData;
}

export interface DimensionMax {
  X: number;
  Y: number;
  Z: number;
}

export interface ExtraData {
  Name: string;
  GroupName: string;
  Category: string;
}
const allIPLs: IPLGroup[] = JSON.parse(alt.File.read('@assets/dump/ipls.json'));

const page = new Page('IPLs / Interiors');
page.addConfirm('Reset IPLs', 'Are you sure?').onInput(comp => {
  logDebug('Resetting IPLs');
  loadDefaultIPLs();
});

const groupPages = new Map<string, Page>();
const groupIPLS = new Map<string, Overlay[]>();
for (const ipl of allIPLs) {
  if (!ipl.ExtraData.GroupName) ipl.ExtraData.GroupName = 'Unknown Group';
  if (!groupPages.has(ipl.ExtraData.GroupName)) {
    const iplPage = new Page(ipl.ExtraData.GroupName);
    groupPages.set(ipl.ExtraData.GroupName, iplPage);
    page.addLink(ipl.Name, `/environment/ipls/${ipl.ExtraData.GroupName}`);
    menu.addPage(`/environment/ipls/${ipl.ExtraData.GroupName}`, iplPage);
    groupIPLS.set(ipl.ExtraData.GroupName, []);
  }
  const iplPage = groupPages.get(ipl.ExtraData.GroupName);
  const overlay = iplPage.addOverlay(ipl.Name, ['Activate', 'Teleport To', 'Deactivate']).onInput(comp => {
    switch (comp.value) {
      case 'Activate':
        alt.requestIpl(ipl.Name);
        break;
      case 'Teleport To':
        teleport(new alt.Vector3(ipl.Position.X, ipl.Position.Y, ipl.Position.Z));
        break;

      case 'Deactivate':
        alt.removeIpl(ipl.Name);
        break;
    }
    overlay.context = getContext(overlay.text);
  });
  groupIPLS.get(ipl.ExtraData.GroupName).push(overlay);

  iplPage.onBeforeOpen(async () => {
    logDebug('Refreshing IPLs');
    for (const overlay of groupIPLS.get(ipl.ExtraData.GroupName)) {
      overlay.context = getContext(overlay.text);
    }
  });
}

function getContext(iplname: string) {
  return `Active: ${native.isIplActive(iplname) ? '<span style="color:rgb(var(--color-success-500));">Yes</span>' : '<span style="color:rgb(var(--color-error-500));">No</span>'}`;
}

export default page;

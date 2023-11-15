import * as alt from 'alt-client';
import * as native from 'natives';
import { CharEditorData } from '../../../shared/types/charCreatorData';
import { getHairOverlayFromIndex } from '../../../shared/utils/hairOverlay';
const COLOR_TYPE = [0, 1, 1, 0, 2, 2, 0, 0, 2, 0, 1, 0, 0];

export function updatePedChar(pedId: number, data: CharEditorData, hoveredTattoo?: [number, number]) {
  native.setPedHeadBlendData(
    pedId,
    data.headBlendData.shapeFirst,
    data.headBlendData.shapeSecond,
    data.headBlendData.shapeThird,
    data.headBlendData.skinFirst,
    data.headBlendData.skinSecond,
    data.headBlendData.skinThird,
    data.headBlendData.shapeMix,
    data.headBlendData.skinMix,
    data.headBlendData.thirdMix,
    false
  );

  for (let i = 0; i < data.faceFeature.length; i++) {
    native.setPedMicroMorph(pedId, i, data.faceFeature[i]);
  }

  for (let i = 0; i < data.headOverlays.length; i++) {
    native.setPedHeadOverlay(pedId, i, data.headOverlays[i].index, data.headOverlays[i].opacity);
    native.setPedHeadOverlayTint(pedId, i, COLOR_TYPE[i], data.headOverlays[i].colorID, data.headOverlays[i].secondColorID);
  }

  if (!data.overrideMakeupColor) {
    native.setPedHeadOverlayTint(pedId, 4, 0, 0, 0);
  }

  native.clearPedDecorations(pedId);
  const hairOverlay = getHairOverlayFromIndex(data.hairIndex, data.female);
  if (hairOverlay !== undefined && 'collection' in hairOverlay) {
    native.addPedDecorationFromHashes(pedId, alt.hash(hairOverlay.collection), alt.hash(hairOverlay.overlay));
  }

  if (data.overlays) {
    for (const item of data.overlays) {
      const [overlay, collection] = item.split(',');
      native.addPedDecorationFromHashes(pedId, Number(collection), Number(overlay));
    }
  }

  if (hoveredTattoo) {
    if (!(data.overlays && data.overlays.includes(hoveredTattoo.join(',')))) {
      const [overlay, collection] = hoveredTattoo;
      native.addPedDecorationFromHashes(pedId, Number(collection), Number(overlay));
    }
  }

  native.setPedComponentVariation(pedId, 2, data.hairIndex, 0, 0);
  native.setPedHairTint(pedId, data.hairColor.colorID, data.hairColor.highlightColorID);

  native.setHeadBlendEyeColor(pedId, data.eyeColor);
}

export async function spawnCharCreatorPed(pos: alt.Vector3, heading: number, female = false): Promise<number> {
  const model = alt.hash(female ? 'mp_f_freemode_01' : 'mp_m_freemode_01');
  // native.requestModel(model);
  await alt.Utils.requestModel(model);
  const pedID = native.createPed(4, model, pos.x, pos.y, pos.z, heading, false, false);
  native.freezeEntityPosition(pedID, true);
  native.setEntityInvincible(pedID, true);
  native.setEntityCollision(pedID, false, false);
  native.setEntityAsMissionEntity(pedID, true, false);
  native.setPedCanRagdoll(pedID, false);
  native.setPedCanRagdollFromPlayerImpact(pedID, false);
  native.taskSetBlockingOfNonTemporaryEvents(pedID, true);
  native.setBlockingOfNonTemporaryEvents(pedID, true);
  native.setPedFleeAttributes(pedID, 0, false);

  native.setPedComponentVariation(pedID, 3, 15, 0, 0); // arms
  native.setPedComponentVariation(pedID, 4, 14, 0, 0); // pants
  native.setPedComponentVariation(pedID, 6, 34, 0, 0); // shoes
  native.setPedComponentVariation(pedID, 8, 15, 0, 0); // shirt
  native.setPedComponentVariation(pedID, 11, 15, 0, 0); // torso

  await alt.Utils.requestAnimDict('switch@michael@goodbye_to_jimmy');
  native.taskPlayAnim(pedID, 'switch@michael@goodbye_to_jimmy', 'base', 999, 999, -1, 1, 0, false, false, false);

  return pedID;
}

export async function pedCharCreatorPlayAnim(pedID: number, standing = false) {
  if (standing) {
    native.clearPedTasks(pedID);
    return;
  } else {
    await alt.Utils.requestAnimDict('switch@michael@goodbye_to_jimmy');
    native.taskPlayAnim(pedID, 'switch@michael@goodbye_to_jimmy', 'base', 999, 999, -1, 1, 0, false, false, false);
  }
}

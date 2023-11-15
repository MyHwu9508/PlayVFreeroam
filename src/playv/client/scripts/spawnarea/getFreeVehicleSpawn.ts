import alt from 'alt-client';
import native from 'natives';

export function getFreeVehicleSpawn(modelName: string): [alt.Vector3, alt.Vector3] {
  // alt.log(JSON.stringify(native.getModelDimensions(alt.hash(modelName))));
  if (!alt.getLocalMeta('isInSpawnProtectArea')) return undefined; //only give position if in spawn protected area!!!
  let c = 0;
  let nextVehicle;
  let spawnPos;
  let spawnRot;
  do {
    c++;
    const [, nodePos, heading] = native.getNthClosestVehicleNodeWithHeading(localPlayer.pos.x, localPlayer.pos.y, localPlayer.pos.z, c, new alt.Vector3(0), 0, 0, 1, 0, 3);
    if (!nodePos) return undefined;
    nextVehicle = alt.Utils.getClosestVehicle({ pos: new alt.Vector3(nodePos.x, nodePos.y, nodePos.z), range: 10 });
    spawnRot = new alt.Vector3(0, 0, heading * (Math.PI / 180));
    spawnPos = nodePos;
  } while (c <= 30 && nextVehicle?.valid);
  if (c <= 30) return [spawnPos, spawnRot];

  //Edge case?
}

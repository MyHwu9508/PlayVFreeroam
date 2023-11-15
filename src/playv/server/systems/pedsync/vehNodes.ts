//Unused
// import nodes from './data/nodes.json' assert { type: 'json' };
import { ConVar } from '../../../shared/conf/ConVars';

type Node = {
  position: { x: number; y: number; z: number };
  rotation: number;
};

function getSectorFromCoords(x: number, y: number): Node[] | undefined {
  if (x < -3584 || x > 6144 || y < -5632 || y > 8192) return undefined;
  const cellX = Math.floor((x + 3584) / 512);
  const cellY = Math.floor((y + 5632) / 512);
  return nodes[cellX][cellY] as Node[];
}

function getRandomSectorAroundCoords(x: number, y: number): Node[] | undefined {
  const randomAngle = Math.random() * Math.PI * 2;
  const randomRadius = Math.random() * (ConVar.PEDSYNC.VEHICLE_SPAWN_RADIUS_MAX - ConVar.PEDSYNC.VEHICLE_SPAWN_RADIUS_MIN) + ConVar.PEDSYNC.VEHICLE_SPAWN_RADIUS_MIN;
  const randomX = x + Math.cos(randomAngle) * randomRadius;
  const randomY = y + Math.sin(randomAngle) * randomRadius;
  return getSectorFromCoords(randomX, randomY);
}

export function getRandomVehNodeInRange(x: number, y: number): Node | undefined {
  const sector = getRandomSectorAroundCoords(x, y);
  if (!sector) return undefined;
  const possibleNodes = sector.filter(node => {
    const dist = Math.hypot(node.position.x - x, node.position.y - y);
    return dist > ConVar.PEDSYNC.VEHICLE_SPAWN_RADIUS_MIN && dist < ConVar.PEDSYNC.VEHICLE_SPAWN_RADIUS_MAX;
  });
  return possibleNodes[Math.floor(Math.random() * possibleNodes.length)];
}

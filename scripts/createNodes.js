import fs from 'fs-extra';

const dataRaw = fs.readFileSync('../data/nodes.json');
const allSectors = JSON.parse(dataRaw);
const cells = [];

for (const sector of allSectors) {
  if (cells[sector.CellX] === undefined) {
    cells[sector.CellX] = [];
  }
  for (const node of sector.Nodes) {
    if (node.IsOnWater) continue;
    if (!node.IsValidForGps) continue;

    if (node.IsGravelRoad) continue; //test
    if (node.IsJunction) continue; // test
    if (node.IsPedCrossway) continue; // test
    if (node.IsBackroad) continue; // test

    if (cells[sector.CellX][sector.CellY] === undefined) {
      cells[sector.CellX][sector.CellY] = [];
    }

    const data = {
      freeway: node.IsFreeway,
      position: {
        x: node.Position.X,
        y: node.Position.Y,
        z: node.Position.Z,
      },
    };

    const cNode = node.ConnectedNodes[0];
    if (cNode === undefined) continue;

    const laneCountForward = cNode.LaneCountForward;
    const p0 = node.position;
    const p1 = cNode.position;
    const dv = cNode.position - node.position;
    const dir = dv.normalize();
    const dup = { x: 0, y: 0, z: 1 };
    const right = dir.cross(dup);

    console.log(right);

    data.spawnPosition = { x: 0, y: 0, z: 0 };
    data.rotation = { x: 0, y: 0, z: 1 };
    cells[sector.CellX][sector.CellY].push(data);
  }
}
for (let i = 0; i < cells.length; i++) {
  if (cells[i] === undefined) {
    cells.splice(i, 1);
    i--;
  }
}

for (let i = 0; i < cells.length; i++) {
  let skipCounter = 0;
  for (let j = 0; j < cells[i].length; j++) {
    if (skipCounter++ < 5) {
      cells[i].splice(j--, 1);
      continue;
    }
    if (cells[i][j] === undefined) {
      continue;
    }
  }
}

// const stringLengths = [];
// const xy = [];
// let x = 0;
// let y = 0;
// for (const cellX of cells) {
//   if (cellX === undefined) {
//     stringLengths.push('-...-');
//     continue;
//   }
//   const lengths = [];
//   for (const cellY of cellX) {
//     xy.push({ x, y });
//     y++;
//     if (cellY === undefined) {
//       lengths.push('-');
//       continue;
//     }
//     lengths.push(cellY.length);
//   }
//   x++;
//   y = 0;
//   stringLengths.push(lengths.join('|'));
// }
// console.log('=====================================');
// for (const l of stringLengths) {
//   console.log(l);
// }

fs.writeFileSync('../src/playv/server/systems/pedsync/data/nodes.json', JSON.stringify(cells));

const minMax = new Array(32).fill(0).map(() => new Array(32).fill(undefined));

for (const sector of allSectors) {
  minMax[sector.CellX][sector.CellY] = {
    min: sector.DimensionMin,
    max: sector.DimensionMax,
  };
}

console.log('=====================================');
minMax.splice(0, 9);
minMax.splice(19, 32);

const SELECTED = {
  x: 11,
  y: 17,
};

let i = 0;
for (const l of minMax) {
  l.splice(0, 5);
  const res = l.map((x, j) => {
    if (i === SELECTED.x && j === SELECTED.y) return 'X';
    return x === undefined ? '_' : '#';
  });
  console.log(res.join(''));

  i++;
}
let minX = 0;
let minY = 0;
let maxX = 0;
let maxY = 0;
for (const row of minMax) {
  for (const cell of row) {
    if (cell === undefined) continue;
    minX = Math.min(minX, cell.min.X);
    minY = Math.min(minY, cell.min.Y);
    maxX = Math.max(maxX, cell.max.X);
    maxY = Math.max(maxY, cell.max.Y);
  }
}

console.log('=====================================');
console.log(`minX: ${minX}, minY: ${minY}, maxX: ${maxX}, maxY: ${maxY}`);
console.log('SELECTED: ', SELECTED, minMax[SELECTED.x][SELECTED.y]);

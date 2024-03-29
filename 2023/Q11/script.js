import {readFileLines} from '../utils/readFileLines.js';
import {ROOT_DIR_2023} from '../utils/consts.js';

function findEmptyInRange(n1, n2, emptyIndexes) {
  let count = 0;
  if (n1 < n2) {
    emptyIndexes.forEach(i => {
      if (i > n1 && i < n2) {
        count++;
      }
    });
  } else (
    emptyIndexes.forEach(i => {
      if (i > n2 && i < n1) {
        count++;
      }
    })
  )
  return count;
}

export const question = async () => {
  const lines = await readFileLines(`${ROOT_DIR_2023}Q11/input.txt`);
  const rows = [];
  const emptyRows = [];
  const emptyColumns = [];
  lines.forEach(((line, index) => {
    let split = line.split('');
    rows.push(split);
    if (split.every(e => e === '.')) {
      emptyRows.push(index);
    }
  }));
  const width = rows[0].length;
  for(let i = 0; i < width; i++) {
    const column = rows.map(row => row[i]);
    if (column.every(e => e === '.')) {
      emptyColumns.push(i);
    }
  }
  const galaxyPositions = [];
  for (let y = 0; y < rows.length; y++) {
    for (let x = 0; x < rows[y].length; x++) {
      if (rows[y][x] === '#') {
        galaxyPositions.push({
          x,
          y
        })
      }
    }
  }
  let totalDistance = 0;
  for (let n = 0; n < galaxyPositions.length; n++) {
    for (let m = n + 1; m < galaxyPositions.length; m++) {
      const galaxyN = galaxyPositions[n];
      const galaxyM = galaxyPositions[m];
      const numEmptyX = findEmptyInRange(galaxyN.x, galaxyM.x, emptyColumns);
      const numEmptyY = findEmptyInRange(galaxyN.y, galaxyM.y, emptyRows);
      const distance = Math.abs(galaxyN.x - galaxyM.x) + Math.abs(galaxyN.y - galaxyM.y);
      const additionalX = 999_999 * numEmptyX;
      const additionalY = 999_999 * numEmptyY;
      totalDistance += (distance + additionalX + additionalY);
    }
  }

  console.log(totalDistance);

  return Promise.resolve();
};

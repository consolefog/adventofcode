import {readFileLines} from '../utils/readFileLines.js';
import {ROOT_DIR_2023} from '../utils/consts.js';

export const question = async () => {
  const lines = await readFileLines(`${ROOT_DIR_2023}Q11/input.txt`);
  const rows = [];
  lines.forEach(line => {
    let split = line.split('');
    rows.push(split);
    if (split.every(e => e === '.')) {
      rows.push([...split]);
    }
  });
  const width = rows[0].length;
  const columns = [];
  for(let i = 0; i < width; i++) {
    const column = rows.map(row => row[i]);
    columns.push(column);
    if (column.every(e => e === '.')) {
      columns.push(column);
    }
  }
  const newRows = [];
  for (let i = 0; i < columns[0].length; i++) {
    const newRow = columns.map(col => col[i]);
    newRows.push(newRow);
  }
  const galaxyPositions = [];
  for (let y = 0; y < newRows.length; y++) {
    for (let x = 0; x < newRows[y].length; x++) {
      if (newRows[y][x] === '#') {
        galaxyPositions.push({
          x,
          y
        })
      }
    }
  }
  console.log(galaxyPositions.length);
  let totalDistance = 0;
  for (let n = 0; n < galaxyPositions.length; n++) {
    for (let m = n + 1; m < galaxyPositions.length; m++) {
      const galaxyN = galaxyPositions[n];
      const galaxyM = galaxyPositions[m];
      const distance = Math.abs(galaxyN.x - galaxyM.x) + Math.abs(galaxyN.y - galaxyM.y);
      totalDistance += distance;
    }
  }

  console.log(totalDistance);

  return Promise.resolve();
};

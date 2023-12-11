import {readFileLines} from '../utils/readFileLines.js';
import {ROOT_DIR_2023} from '../utils/consts.js';

function notBackAtStart(position) {
  const S = { x: 119, y: 72 }
  return position.current.x !== S.x || position.current.y !== S.y;
}

function getOtherEnd(letter, startEnd) {
  if (letter === 'S') {
    letter = 'J';
  }
  if (letter === 'F') {
    if (startEnd === 'south') {
      return 'east';
    } else if (startEnd === 'east') {
      return 'south';
    }
    console.log('Error F');
    throw 'Error';
  } else if (letter === '|') {
    if (startEnd === 'south') {
      return 'north';
    } else if (startEnd === 'north') {
      return 'south';
    }
    console.log('Error |');
    throw 'Error';
  } else if (letter === '7') {
    if (startEnd === 'south') {
      return 'west';
    } else if (startEnd === 'west') {
      return 'south';
    }
    console.log('Error 7');
    throw 'Error';
  } else if (letter === 'J') {
    if (startEnd === 'north') {
      return 'west';
    } else if (startEnd === 'west') {
      return 'north';
    }
    console.log('Error J');
    throw 'Error';
  } else if (letter === '-') {
    if (startEnd === 'west') {
      return 'east';
    } else if (startEnd === 'east') {
      return 'west';
    }
    console.log('Error -');
    throw 'Error';
  } else if (letter === 'L') {
    if (startEnd === 'north') {
      return 'east';
    } else if (startEnd === 'east') {
      return 'north';
    }
    console.log('Error L');
    throw 'Error';
  }
  console.log(letter);
  throw 'Error';
}

function getNextPosition(position, grid) {
  let newCurrent = undefined;
  let newEnd = undefined;
  let currentY = position.current.y;
  let currentX = position.current.x;
  let letter = grid[currentY][currentX];
  let otherEnd = getOtherEnd(letter, position.end);
  if (otherEnd === 'south') {
    newEnd = 'north';
    newCurrent = {
      x: position.current.x,
      y: position.current.y + 1,
    };
  } else if (otherEnd === 'north') {
    newEnd = 'south';
    newCurrent = {
      x: position.current.x,
      y: position.current.y - 1,
    };
  } else if (otherEnd === 'west') {
    newEnd = 'east';
    newCurrent = {
      x: position.current.x - 1,
      y: position.current.y,
    };
  } else if (otherEnd === 'east') {
    newEnd = 'west'
    newCurrent = {
      x: position.current.x + 1,
      y: position.current.y,
    };
  }

  if (newCurrent.x > grid[0].length - 1) {
    console.log('x too big');
  }
  if (newCurrent.y > grid.length - 1) {
    console.log('y too big');
  }

  if (newEnd === undefined) {
    throw 'Error';
  }
  if (newCurrent === undefined) {
    throw 'Error';
  }

  return {
    end: newEnd,
    current: newCurrent,
  }
}

export const question = async () => {
  const lines = await readFileLines(`${ROOT_DIR_2023}Q10/input.txt`);
  let rows = [];
  let start = {
    x: -1,
    y: -1,
  }
  lines.forEach(((line, rowIndex) => {
    let row = line.split('')
    let sIndex = row.indexOf('S');
    if (sIndex !== -1) {
      start.x = sIndex;
      start.y = rowIndex;
    }
    rows.push(row);
  }));

  console.log(start);

  let position = {
    current: start,
    end: 'north',
  }

  let first = true;

  let count = 0;
  let pathPoints = [];
  while(notBackAtStart(position) || first) {
    pathPoints.push(position.current);
    first = false
    position = getNextPosition(position, rows);
    count++;
  }

  for(let y = 0; y < rows.length; y++) {
    for(let x = 0; x < rows[y].length; x++) {
      if (pathPoints.some(p => {
        return p.x === x && p.y === y
      })) {
        rows[y][x] = '.'
      } else {
        rows[y][x] = 'x';
      }
    }
  }

  rows.forEach(row => {
    console.log(row.join(''));
  })

  console.log(count, count / 2);

  return Promise.resolve();
};

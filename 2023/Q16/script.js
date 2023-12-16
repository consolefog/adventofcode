import {readFileLines} from '../utils/readFileLines.js';
import {ROOT_DIR_2023} from '../utils/consts.js';

const getReflectedDirection = (mirrorLetter, currentDirection) => {
  return {
    'east': {
      '/': 'north',
      '\\': 'south'
    },
    'west': {
      '/': 'south',
      '\\': 'north'
    },
    'north': {
      '/': 'east',
      '\\': 'west'
    },
    'south': {
      '/': 'west',
      '\\': 'east'
    }
  }[currentDirection][mirrorLetter];
}

const getBeamDirectionsPostInteraction = (splitterLetter, currentDirection) => {
  return {
    'east': {
      '-': ['east'],
      '|': ['north', 'south']
    },
    'west': {
      '-': ['west'],
      '|': ['north', 'south']
    },
    'north': {
      '-': ['west', 'east'],
      '|': ['north']
    },
    'south': {
      '-': ['west', 'east'],
      '|': ['south']
    }
  }[currentDirection][splitterLetter];
}

const isXYOutsideOfGrid = (grid, point) => {
  const gridWidth = grid[0].length;
  const gridHeight = grid.length;
  if (point.x < 0 || point.x >= gridWidth) {
    return true;
  }
  return point.y < 0 || point.y >= gridHeight;
};

let pointsSeen = new Set();

const progressBeam = async (grid, beam, beamJourney) => {
  pointsSeen.add(`${beam.x},${beam.y}`);

  const hash = `${beam.x},${beam.y},${beam.direction}`;
  if (beamJourney.has(hash)) {
    // this beam is now going round in circles.
    return;
  }

  beamJourney.add(hash);

  if (beam.direction === 'east') {
    beam.x = beam.x + 1;
  } else if (beam.direction === 'west') {
    beam.x = beam.x -1;
  } else if (beam.direction === 'north') {
    beam.y = beam.y - 1;
  } else if (beam.direction === 'south') {
    beam.y = beam.y + 1;
  } else {
    throw `Error - unknown direction ${beam.direction}`
  }

  if (isXYOutsideOfGrid(grid, beam)) {
    return;
  }

  const itemInteractingWith = grid[beam.y][beam.x];

  if (itemInteractingWith === '.') {
    // same direction
    return await progressBeam(grid, {
      ...beam,
    }, beamJourney);
  } else if (itemInteractingWith === '/' || itemInteractingWith === '\\') {
    return await progressBeam(grid, {
      ...beam,
      direction: getReflectedDirection(itemInteractingWith, beam.direction)
    }, beamJourney);
  } else if (itemInteractingWith === '|' || itemInteractingWith === '-') {
    const directions = getBeamDirectionsPostInteraction(itemInteractingWith, beam.direction);
    if (directions.length === 1) {
      return await progressBeam(grid, {
        ...beam,
        direction: directions[0],
      }, beamJourney);
    } else {
      await progressBeam(grid,{
        ...beam,
        direction: directions[0],
      }, beamJourney);
      return await progressBeam(grid,{
        ...beam,
        direction: directions[1],
      }, beamJourney)
    }
  } else {
    throw `Error - unknown item ${itemInteractingWith}`;
  }
};

const getGridHeightAndWidth = (grid) => {
  const gridWidth = grid[0].length;
  const gridHeight = grid.length;
  return {
    height: gridHeight,
    width: gridWidth
  }
}

const printPointsSeenAsciiArt = grid => {
  const dimensions= getGridHeightAndWidth(grid)

  const art = [];
  for (let i = 0; i < dimensions.height; i++) {
    const row = [];
    for (let j = 0; j < dimensions.width; j++) {
      row.push('.');
    }
    art.push(row);
  }

  pointsSeen.forEach(point => {
    const split = point.split(',');
    const x = parseInt(split[0], 10);
    const y = parseInt(split[1], 10);
    art[y][x] = '#';
  });

  art.forEach(row => {
    console.log(row.join(''));
  });
};

async function countNumberEnergized(startX, startY, startDirection, grid) {
  await progressBeam(grid, {
    x: startX,
    y: startY,
    direction: startDirection,
  }, new Set());
  pointsSeen.delete(`${startX},${startY}`);
  return pointsSeen.size;
}

export const question = async () => {
  const lines = await readFileLines(`${ROOT_DIR_2023}Q16/input.txt`);
  const grid = [];
  lines.forEach(line => {
    grid.push(line.split(''));
  });

  const dimensions = getGridHeightAndWidth(grid);

  let numberEnergizedRecord = 0;

  // going east from left edge
  for (let startY = 0; startY < dimensions.height; startY++) {
    pointsSeen = new Set();
    const numberEnergized = await countNumberEnergized(-1, startY, 'east', grid);
    numberEnergizedRecord = Math.max(numberEnergizedRecord, numberEnergized);
  }
  // going west from right edge
  for (let startY = 0; startY < dimensions.height; startY++) {
    pointsSeen = new Set();
    const numberEnergized = await countNumberEnergized(dimensions.width, startY, 'west', grid);
    numberEnergizedRecord = Math.max(numberEnergizedRecord, numberEnergized);
  }
  // going south from top edge
  for (let startX = 0; startX < dimensions.width; startX++) {
    pointsSeen = new Set();
    const numberEnergized = await countNumberEnergized(startX, -1, 'south', grid);
    numberEnergizedRecord = Math.max(numberEnergizedRecord, numberEnergized);
  }
  // going north from bottom edge
  for (let startX = 0; startX < dimensions.width; startX++) {
    pointsSeen = new Set();
    const numberEnergized = await countNumberEnergized(startX, dimensions.height, 'north', grid);
    numberEnergizedRecord = Math.max(numberEnergizedRecord, numberEnergized);
  }

  console.log(numberEnergizedRecord);

  return Promise.resolve();
};

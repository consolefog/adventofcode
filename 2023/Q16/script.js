import {readFileLines} from '../utils/readFileLines.js';
import {ROOT_DIR_2023} from '../utils/consts.js';
import {getGridHeightAndWidth, isOutOfBounds} from './gridUtil.js';

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


let pointsSeen = new Set();

const progressBeam = async (grid, beam, beamJourney) => {
  const xyHash = `${beam.x},${beam.y}`;
  const xydHash = `${xyHash},${beam.direction}`;
  pointsSeen.add(xyHash);

  if (beamJourney.has(xydHash)) {
    // this beam is now going round in circles.
    return;
  } else {
    beamJourney.add(xydHash);
  }

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

  if (isOutOfBounds(grid, beam)) {
    return;
  }

  const thingHere = grid[beam.y][beam.x];

  if (thingHere === '.') {
    // same direction
    return await progressBeam(grid, {
      ...beam,
    }, beamJourney);
  } else if (thingHere === '/' || thingHere === '\\') {
    return await progressBeam(grid, {
      ...beam,
      direction: getReflectedDirection(thingHere, beam.direction)
    }, beamJourney);
  } else if (thingHere === '|' || thingHere === '-') {
    const directions = getBeamDirectionsPostInteraction(thingHere, beam.direction);
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
    throw `Error - unknown item "${thingHere}"`;
  }
};

const countNumberEnergized = async (startX, startY, startDirection, grid) => {
  await progressBeam(grid, {
    x: startX,
    y: startY,
    direction: startDirection,
  }, new Set());
  // we start out of bounds so delete that point.
  pointsSeen.delete(`${startX},${startY}`);
  return pointsSeen.size;
};

export const question = async () => {
  let best = 0;

  const lines = await readFileLines(`${ROOT_DIR_2023}Q16/input.txt`);
  const grid = lines.map(line => line.split(''));
  const gridDimensions = getGridHeightAndWidth(grid);

  // going east from left edge
  for (let startY = 0; startY < gridDimensions.height; startY++) {
    pointsSeen = new Set();
    const numberEnergized = await countNumberEnergized(-1, startY, 'east', grid);
    best = Math.max(best, numberEnergized);
  }

  // going west from right edge
  for (let startY = 0; startY < gridDimensions.height; startY++) {
    pointsSeen = new Set();
    const numberEnergized = await countNumberEnergized(gridDimensions.width, startY, 'west', grid);
    best = Math.max(best, numberEnergized);
  }

  // going south from top edge
  for (let startX = 0; startX < gridDimensions.width; startX++) {
    pointsSeen = new Set();
    const numberEnergized = await countNumberEnergized(startX, -1, 'south', grid);
    best = Math.max(best, numberEnergized);
  }

  // going north from bottom edge
  for (let startX = 0; startX < gridDimensions.width; startX++) {
    pointsSeen = new Set();
    const numberEnergized = await countNumberEnergized(startX, gridDimensions.height, 'north', grid);
    best = Math.max(best, numberEnergized);
  }

  console.log(best);

  return Promise.resolve();
};

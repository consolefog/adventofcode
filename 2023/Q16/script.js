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

  switch (beam.direction) {
    case 'east':
      beam.x = beam.x + 1;
      break;
    case 'west':
      beam.x = beam.x - 1;
      break;
    case 'north':
      beam.y = beam.y - 1;
      break;
    case 'south':
      beam.y = beam.y + 1;
      break;
    default:
      throw `Error - unknown direction ${beam.direction}`;
  }

  if (isOutOfBounds(grid, beam)) {
    return;
  }

  switch (grid[beam.y][beam.x]) {
    case '.': // same direction
      return await progressBeam(grid, {
        ...beam,
      }, beamJourney);
    case '/':
    case '\\':
      return await progressBeam(grid, {
        ...beam,
        direction: getReflectedDirection(grid[beam.y][beam.x], beam.direction)
      }, beamJourney);
    case '|':
    case '-':
      const directions = getBeamDirectionsPostInteraction(grid[beam.y][beam.x], beam.direction);
      if (directions.length === 1) {
        return await progressBeam(grid, {
          ...beam,
          direction: directions[0],
        }, beamJourney);
      } else {
        await progressBeam(grid, {
          ...beam,
          direction: directions[0],
        }, beamJourney);
        return await progressBeam(grid, {
          ...beam,
          direction: directions[1],
        }, beamJourney);
      }
    default:
      throw `Error - unknown item "${grid[beam.y][beam.x]}"`;
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
  const lines = await readFileLines(`${ROOT_DIR_2023}Q16/input.txt`);
  const grid = lines.map(line => line.split(''));
  const gridDimensions = getGridHeightAndWidth(grid);
  const gridHeight = gridDimensions.height;
  const gridWidth = gridDimensions.width;

  let best = 0;

  // going east from left edge
  for (let row = 0; row < gridHeight; row++) {
    pointsSeen = new Set();
    const numberEnergized = await countNumberEnergized(-1, row, 'east', grid);
    best = Math.max(best, numberEnergized);
  }

  // going west from right edge
  for (let row = 0; row < gridHeight; row++) {
    pointsSeen = new Set();
    const numberEnergized = await countNumberEnergized(gridWidth, row, 'west', grid);
    best = Math.max(best, numberEnergized);
  }

  // going south from top edge
  for (let column = 0; column < gridWidth; column++) {
    pointsSeen = new Set();
    const numberEnergized = await countNumberEnergized(column, -1, 'south', grid);
    best = Math.max(best, numberEnergized);
  }

  // going north from bottom edge
  for (let column = 0; column < gridWidth; column++) {
    pointsSeen = new Set();
    const numberEnergized = await countNumberEnergized(column, gridHeight, 'north', grid);
    best = Math.max(best, numberEnergized);
  }

  console.log(best);

  return Promise.resolve();
};

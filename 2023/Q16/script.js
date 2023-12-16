import {readFileLines} from '../utils/readFileLines.js';
import {ROOT_DIR_2023} from '../utils/consts.js';
import {getGridHeightAndWidth, isOutOfBounds} from './gridUtil.js';

let pointsSeen = new Set();

const progressBeam = async (grid, beam, beamJourney) => {
  const currentDirection = beam.direction;
  const xyHash = `${beam.x},${beam.y}`;
  const xydHash = `${xyHash},${currentDirection}`;
  pointsSeen.add(xyHash);

  if (beamJourney.has(xydHash)) {
    // this beam is now going round in circles.
    return;
  } else {
    beamJourney.add(xydHash);
  }

  switch (currentDirection) {
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
      throw `Error - unknown direction ${currentDirection}`;
  }

  if (isOutOfBounds(grid, beam)) {
    return;
  }

  const letter = grid[beam.y][beam.x];

  switch (letter) {
    case '.':
      return await progressBeam(grid, beam, beamJourney);
    case '/':
    case '\\':
    case '|':
    case '-':
      return await Promise.all({
        'east': {
          '/': ['north'],
          '\\': ['south'],
          '-': ['east'],
          '|': ['north', 'south']
        },
        'west': {
          '/': ['south'],
          '\\': ['north'],
          '-': ['west'],
          '|': ['north', 'south']
        },
        'north': {
          '/': ['east'],
          '\\': ['west'],
          '-': ['west', 'east'],
          '|': ['north']
        },
        'south': {
          '/': ['west'],
          '\\': ['east'],
          '-': ['west', 'east'],
          '|': ['south']
        }
      }[currentDirection][letter].map(newDirection => {
        progressBeam(grid, {
          ...beam,
          direction: newDirection,
        }, beamJourney);
      }));
    default:
      throw `Error - unknown item "${letter}"`;
  }
};

const countNumberEnergized = async (startX, startY, startDirection, grid) => {
  const beam = {
    x: startX,
    y: startY,
    direction: startDirection,
  };
  await progressBeam(grid, beam, new Set());
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

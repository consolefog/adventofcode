import {readFileLines} from '../utils/readFileLines.js';
import {ROOT_DIR_2023} from '../utils/consts.js';
import {getGridHeightAndWidth, isOutOfBounds} from './gridUtil.js';

let pointsSeen;

const energize = async (grid, beam, beamJourney) => {
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
      return await energize(grid, beam, beamJourney);
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
        energize(grid, {
          ...beam,
          direction: newDirection,
        }, beamJourney);
      }));
    default:
      throw `Error - unknown letter "${letter}"`;
  }
};

const count = async (startX, startY, startDirection, grid) => {
  pointsSeen = new Set();
  const beam = {
    x: startX,
    y: startY,
    direction: startDirection,
  };
  await energize(grid, beam, new Set());
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
  const leftEdge = -1;
  const rightEdge = gridWidth;
  const topEdge = -1;
  const bottomEdge = gridHeight;

  let best = 0;

  for (let y = 0; y < gridHeight; y++) {
    // going east from left edge
    best = Math.max(best, await count(leftEdge, y, 'east', grid));
    // going west from right edge
    best = Math.max(best, await count(rightEdge, y, 'west', grid));
  }

  for (let x = 0; x < gridWidth; x++) {
    // going south from top edge
    best = Math.max(best, await count(x, topEdge, 'south', grid));
    // going north from bottom edge
    best = Math.max(best, await count(x, bottomEdge, 'north', grid));
  }


  console.log(best);

  return Promise.resolve();
};

import {readFileLines} from '../utils/readFileLines.js';
import {ROOT_DIR_2023} from '../utils/consts.js';

function arrayOfAllDots(lineLength) {
  console.log(lineLength);
  let retVal = [];
  for(let i = 0; i < lineLength; i++) {
    retVal.push('.');
  }
  return retVal;
}

function isADigit(str) {
  return /[0123456789]/.test(str);
}

function isSymbol(str) {
  return !isADigit(str) && str !== '.'
}

function isSymbolNearby(grid, beginningCoordinates, length) {
  // row above
  for (let i = beginningCoordinates.x - 1; i < (beginningCoordinates.x + length + 1); i++) {
    if (isSymbol(grid[beginningCoordinates.y - 1][i])) {
      return true;
    }
  }
  // row below
  for (let i = beginningCoordinates.x - 1; i < (beginningCoordinates.x + length + 1); i++) {
    if (isSymbol(grid[beginningCoordinates.y + 1][i])) {
      return true;
    }
  }
  // left
  if (isSymbol(grid[beginningCoordinates.y][beginningCoordinates.x - 1])) {
    return true;
  }
  // right
  if (isSymbol(grid[beginningCoordinates.y][beginningCoordinates.x + length])) {
    return true;
  }
  return false;
}

function analyzeNumbers(grid, lineLength, rowCount) {
  const islandNumbers = [];
  const partNumbers = [];
  let currentNumber = '';
  let beginningCoordinates = {
    x: undefined,
    y: undefined,
  }
  for (let y = 1; y < rowCount - 1; y++) {
    for (let x = 1; x < lineLength - 1; x++) {
      // co-ordinates (x,y).
      if (isADigit(grid[y][x])) {
        if (currentNumber === '') {
          beginningCoordinates.x = x;
          beginningCoordinates.y = y;
        }
        currentNumber += grid[y][x];
      }

      let isEndOfRow = (x === (lineLength - 2));
      const stopBuildingCurrentNumber = !isADigit(grid[y][x]) || isEndOfRow

      if (currentNumber !== '' && stopBuildingCurrentNumber) {
        if (isSymbolNearby(grid, beginningCoordinates, currentNumber.length)) {
          partNumbers.push({
            number: parseInt(currentNumber, 10),
            beginningCoordinates: {
              ...beginningCoordinates
            }
          });
        } else {
          islandNumbers.push({
            number: parseInt(currentNumber, 10),
            beginningCoordinates: {
              ...beginningCoordinates
            }
          });
        }
        // reset state
        beginningCoordinates.x = undefined;
        beginningCoordinates.y = undefined;
        currentNumber = '';
      }
    }
  }
  return {
    islandNumbers: islandNumbers,
    partNumbers: partNumbers
  };
}

function generateSurroundingCoordinate(beginningCoordinates, length) {
  const retVal = [];
  // row above
  for (let i = beginningCoordinates.x - 1; i < (beginningCoordinates.x + length + 1); i++) {
    retVal.push({
      x: i,
      y: beginningCoordinates.y - 1,
    });
  }
  // row below
  for (let i = beginningCoordinates.x - 1; i < (beginningCoordinates.x + length + 1); i++) {
    retVal.push({
      x: i,
      y: beginningCoordinates.y + 1,
    })
  }
  // left
  retVal.push({
    x: beginningCoordinates.x - 1,
    y: beginningCoordinates.y,
  })
  // right
  retVal.push({
    x: beginningCoordinates.x + length,
    y: beginningCoordinates.y,
  })
  return retVal;
}

function getPartNumberNeighbors(x, y, partNumberInfos) {
  const retVal = [];
  partNumberInfos.forEach(info => {
    const isNeighbor = info.borderCoordinateList.some(c => {
      return c.x === x && c.y === y;
    });
    if (isNeighbor) {
      retVal.push(info.number);
    }
  })
  return retVal;
}

export const question = async () => {
  const lines = await readFileLines(`${ROOT_DIR_2023}Q3/input.txt`);
  let lineLength = lines[0].length + 2; // add a dot at each end.
  const grid = [];
  grid.push(arrayOfAllDots(lineLength));
  lines.forEach(line => {
    grid.push(['.', ...line.split(''), '.'])
  });
  grid.push(arrayOfAllDots(lineLength));

  const response = analyzeNumbers(grid, lineLength, lines.length + 2);
  let total = 0;
  const partNumberInfos = [];
  response.partNumbers.forEach(n => {
    const beginningCoordinates = n.beginningCoordinates;
    const numberLength = `${(n.number)}`.length;
    partNumberInfos.push({
      number: n.number,
      borderCoordinateList: generateSurroundingCoordinate(beginningCoordinates, numberLength)
    });
  });
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] === '*') {
        const partNumberNeighbors = getPartNumberNeighbors(x, y, partNumberInfos);
        if (partNumberNeighbors.length === 2) {
          // gear
          total += (partNumberNeighbors[0] * partNumberNeighbors[1])
        }
      }
    }
  }

  console.log(total);

  return Promise.resolve();
};

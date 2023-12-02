import {readFileLines} from '../utils/readFileLines.js';
import {ROOT_DIR_2023} from '../utils/consts.js';

const IS_PART_ONE = false;

const parseRBGAmounts = (phrase) => {
  const elements = phrase.split(',').map(p => p.trim());
  const retVal = {
    red: 0,
    green: 0,
    blue: 0,
  };
  elements.forEach(element => {
    const numberAndColor = element.split(' ');
    const number = parseInt(numberAndColor[0], 10);
    const color = numberAndColor[1];
    retVal[color] = retVal[color] + number;
  })
  return retVal;
}

export const question = async () => {
  const lines = await readFileLines(`${ROOT_DIR_2023}Q2/input.txt`);

  const max = {
    red: 12,
    green: 13,
    blue: 14,
  }

  let total = 0;

  lines.forEach(line => {
    const gameAndRest = line.split(':')
    const gameMessy = gameAndRest[0];
    const restMessy = gameAndRest[1];
    const gameWordAndGameId = gameMessy.split(' ');
    const gameIdString = gameWordAndGameId[1];
    const gameIdNumber = parseInt(gameIdString, 10);
    const restMessyTrimmed = restMessy.trim();
    const bagGrabs = restMessyTrimmed.split(';').map(grab => grab.trim());
    const normalized = bagGrabs.map(bg => parseRBGAmounts(bg));

    if (IS_PART_ONE) {
      const normalizedHasAnyAboveMax = normalized.some(n => {
        return n.red > max.red || n.green > max.green || n.blue > max.blue;
      });

      if (!normalizedHasAnyAboveMax) {
        total += gameIdNumber;
      }
    } else {
      const minCounts = normalized[0];
      normalized.forEach(n => {
        minCounts.red = Math.max(minCounts.red, n.red);
        minCounts.green = Math.max(minCounts.green, n.green);
        minCounts.blue = Math.max(minCounts.blue, n.blue);
      });

      total += (minCounts.red * minCounts.blue * minCounts.green);
    }
  });

  console.log(total);

  return Promise.resolve();
};

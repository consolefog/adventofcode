import {readFileLines} from '../utils/readFileLines.js';
import {ROOT_DIR_2023} from '../utils/consts.js';

const readNumberArray = numbersString => numbersString.split(' ').map(s => s.trim()).map(s => parseInt(s, 10));

export const question = async () => {
  const lines = (await readFileLines(`${ROOT_DIR_2023}Q5/input.txt`)).filter(line => line !== '');

  const maps = [];
  const seedRanges = [];

  lines.forEach(line => {
    if (line.includes('seeds')) {
      const seeds = line.split(': ')[1];
      const seedNumberPairs = readNumberArray(seeds);
      for(let i = 0; i < seedNumberPairs.length - 1; i = i + 2) {
        seedRanges.push({
          from: seedNumberPairs[i],
          to: seedNumberPairs[i] + seedNumberPairs[i + 1] - 1,
        });
      }
    } else {
      if (line.includes('-to-')) {
        const newMap = {}
        const left = line.split(' ')[0];
        const fromTo = left.split('-to-');
        newMap.from = fromTo[0];
        newMap.to = fromTo[1];
        newMap.ranges = [];
        maps.push(newMap);
      } else {
        const map = maps[maps.length - 1];
        if (!map) {
          throw 'Error Empty Map';
        }
        const mappingNumbers = readNumberArray(line);
        if (mappingNumbers.length !== 3) {
          throw 'Error Length';
        }
        const range = {};
        range.toRangeStart = mappingNumbers[0];
        range.toRangeEnd = mappingNumbers[0] + mappingNumbers[2] - 1;
        range.fromRangeStart = mappingNumbers[1];
        range.fromRangeEnd = mappingNumbers[1] + mappingNumbers[2] - 1;
        range.lowestLocationSeen = undefined;
        map.ranges.push(range);
      }
    }
  });

  const getLocationForSeed = seed => {
    let fromKey = seed;
    maps.forEach(map => {
      let toKey = fromKey;
      const ranges = map.ranges;
      ranges.forEach(range => {
        if (fromKey >= range.fromRangeStart && fromKey <= range.fromRangeEnd) {
          const diff = fromKey - range.fromRangeStart;
          toKey = range.toRangeStart + diff;
        }
      });
      fromKey = toKey;
    })
    return fromKey;
  };

  let lowest = -1;

  seedRanges.forEach(range => {
    console.log(range, range.to - range.from, 'of', seedRanges.length);
    for (let i = range.from; i <= range.to; i++) {
      const location = getLocationForSeed(i);
      if (lowest === -1 || location < lowest) {
        lowest = location;
      }
    }
    console.log(lowest);
  });

  console.log(lowest);

  return Promise.resolve();
};

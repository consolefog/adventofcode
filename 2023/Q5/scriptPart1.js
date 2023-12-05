import {readFileLines} from '../utils/readFileLines.js';
import {ROOT_DIR_2023} from '../utils/consts.js';

const readNumberArray = numbersString => numbersString.split(' ').map(s => s.trim()).map(s => parseInt(s, 10));

export const question = async () => {
  const lines = (await readFileLines(`${ROOT_DIR_2023}Q5/input.txt`)).filter(line => line !== '');

  const maps = [];
  let seedNumbers;

  lines.forEach(line => {
    if (line.includes('seeds')) {
      const seeds = line.split(': ')[1];
      seedNumbers = readNumberArray(seeds);
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
        map.ranges.push(range);
      }
    }
  });

  maps.forEach(map => {
    console.log(map, [...map.ranges])
  })

  let lowestLocation = -1;

  seedNumbers.forEach(seed => {
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
    console.log('seed', seed, fromKey);
    if (lowestLocation === -1 || fromKey < lowestLocation) {
      lowestLocation = fromKey;
    }
  });

  console.log(lowestLocation);

  return Promise.resolve();
};

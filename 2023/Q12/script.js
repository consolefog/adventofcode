import {readFileLines} from '../utils/readFileLines.js';
import {ROOT_DIR_2023} from '../utils/consts.js';

const IS_PART_2 = true;
const ENABLE_CACHE = true;

const parseGroupsArray = string => {
  return string.split(',').map(i => i.trim()).map(i => parseInt(i, 10));
};

let cache = {}

const getMatchesWithCache = state => {
  const cacheKey = `${state.after}-${state.afterGroups.join('_')}`
  if (cache[cacheKey]) {
    return cache[cacheKey];
  } else {
    const matches = getMatches(state);
    cache[cacheKey] = matches;
    return matches;
  }
}

const getMatchesOptimized = state => {
  if (ENABLE_CACHE) {
    return getMatchesWithCache(state);
  } else {
    return getMatches(state);
  }
}

const getMatches = state => {
  const { after, afterGroups } = state;

  if (after.length === 0) {
    if (afterGroups.length === 0) {
      return 1;
    } else {
      return 0;
    }
  }

  if (afterGroups.length > 0) {
    let space = 0;
    for(let i = 0; i < afterGroups.length; i++) {
      space += afterGroups[i];
      space += 1;
    }
    space -= 1;
    if (space > after.length) {
      return 0;
    }
  }

  if (afterGroups.length === 0) {
    if (after.indexOf('#') === -1) {
      return 1;
    } else {
      return 0;
    }
  }

  const firstLetterOfAfter = after[0];
  switch (firstLetterOfAfter) {
    case '.':
      return getMatchesOptimized({
        after: after.slice(1),
        afterGroups: afterGroups,
      });
    case '?':
      const matchesWithDot = getMatchesOptimized({
        after: ['.', ...after.slice(1)],
        afterGroups: afterGroups,
      });
      if (afterGroups.length !== 0) {
        const matchesWithHash = getMatchesOptimized({
          after: ['#', ...after.slice(1)],
          afterGroups: afterGroups,
        });
        return matchesWithHash + matchesWithDot;
      } else {
        return matchesWithDot;
      }
    case '#':
      if (afterGroups.length === 0) {
        return 0;
      } else {
        // let read = '';
        const totalHash = afterGroups[0];
        if (after.length < totalHash) {
          return 0;
        }
        for (let i = 0; i < totalHash; i++) {
          const letter = after[i];
          if (letter === '.') {
            return 0;
          }
        }

        if (after.length === totalHash) {
          return getMatchesOptimized({
            after: [],
            afterGroups: afterGroups.slice(1)
          });
        } else {
          if (after[totalHash] === '#') {
            return 0;
          } else {
            return getMatchesOptimized({
              after: after.slice(totalHash + 1),
              afterGroups: afterGroups.slice(1)
            });
          }
        }
      }
    default:
      throw 'Error';
  }
};

export const question = async () => {
  const lines = await readFileLines(`${ROOT_DIR_2023}Q12/input.txt`);

  let sum = 0;
  lines.forEach((line, index) => {
    const split = line.split(' ');
    const patternSplit = split[0];
    const groupsSplit = split[1];

    const patternFive = [patternSplit, patternSplit, patternSplit, patternSplit, patternSplit].join('?').replaceAll(/\.+/g, '.');
    const afterGroupsFive = parseGroupsArray([groupsSplit, groupsSplit, groupsSplit, groupsSplit, groupsSplit].join(','));

    console.log('running', index, patternFive);
    const matches = getMatches({
      after: IS_PART_2 ? patternFive.split('') : patternSplit.split(''),
      afterGroups: IS_PART_2 ? afterGroupsFive : parseGroupsArray(groupsSplit)
    });

    sum += matches;
  });

  console.log(sum);

  return Promise.resolve();
};

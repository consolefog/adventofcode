import {readFileLines} from '../utils/readFileLines.js';
import {ROOT_DIR_2023} from '../utils/consts.js';

const parseGroupsArray = string => {
  return string.split(',').map(i => i.trim()).map(i => parseInt(i, 10));
};

// const getLengthsForString = c => {
//   const groups = c.replaceAll(/\.+/g, '.').split('.').filter(g => g.length !== 0);
//   return groups.map(g => g.length);
// };

const getLengthsForString = (c, caches) => {
  let currLength = 0;
  const retVal = [];
  for (let i = 0; i < c.length; i++) {
    let l = c.charAt(i);
    if (l !== '.') {
      currLength++;
    } else {
      if (currLength !== 0) {
        retVal.push(currLength);
      }
      currLength = 0;
    }
  }
  if (currLength !== 0) {
    retVal.push(currLength);
  }
  return retVal;
}

const lengthsMatchGroups = (str, groups, caches) => {
  if (str.length === 0) {
    return true;
  }

  const lengths = getLengthsForString(str, caches);

  if (lengths.length > 0) {
    for(let i = 0; i < lengths.length - 1; i++) {
      if (groups[groups.length - 1 - i] !== lengths[lengths.length - 1 - i]) {
        return false;
      }
    }
    return groups[groups.length - lengths.length] >= lengths[0];
  } else {
    return true;
  }
};

const getAllPossibilities = (queryString, groups, fullLength, caches) => {
  let firstQuestion = queryString.indexOf('?');
  if (firstQuestion !== -1) {
    const beforeQuestion = queryString.substring(0, firstQuestion);
    const afterQuestion = queryString.substring(firstQuestion + 1);
    let all = getAllPossibilities(`${afterQuestion}`, groups, fullLength, caches);
    let superValidA = all.map(x => `${beforeQuestion}#${x}`).filter((p) => lengthsMatchGroups(p, groups, caches));
    let superValidB = all.map(x => `${beforeQuestion}.${x}`).filter((p) => lengthsMatchGroups(p, groups, caches));
    return [...superValidA, ...superValidB];
  } else {
    return [queryString];
  }
};

export const question = async () => {
  const lines = await readFileLines(`${ROOT_DIR_2023}Q12/input.txt`);
  const caches = {};

  let sum = 0;
  lines.forEach(line => {
    const split = line.split(' ');
    const original = `${split[0]}?${split[0]}?${split[0]}?${split[0]}?${split[0]}`.replaceAll(/\.+/g, '.');
    const groups = parseGroupsArray(`${split[1]},${split[1]},${split[1]},${split[1]},${split[1]}`);
    console.log(original, 'finding possibilities...');
    let allPossibilities = getAllPossibilities(original, groups, original.length, caches);
    const matches = allPossibilities.filter(p => {
      const lengths = getLengthsForString(p, caches);
      if (lengths.length !== groups.length) {
        return false;
      } else {
        let allSame = true;
        for (let i = 0; i < lengths.length; i++) {
          if (lengths[i] !== groups[i]) {
            allSame = false;
            break;
          }
        }
        return allSame;
      }
    })
    console.log(original, `[${groups.join(',')}]`, matches.length);
    sum += matches.length;
  });

  console.log(sum);

  return Promise.resolve();
};

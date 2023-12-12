import {readFileLines} from '../utils/readFileLines.js';
import {ROOT_DIR_2023} from '../utils/consts.js';

const parseGroupsArray = string => {
  return string.split(',').map(i => i.trim()).map(i => parseInt(i, 10));
};

const getAllPossibilities = string => {
  let firstQuestion = string.indexOf('?');
  if (firstQuestion !== -1) {
    const beforeQuestion = string.substring(0, firstQuestion);
    const afterQuestion = string.substring(firstQuestion + 1);
    const allPossibilitiesAfterQuestion = getAllPossibilities(afterQuestion);
    const withHash = allPossibilitiesAfterQuestion.map(p => `${beforeQuestion}#${p}`);
    const withDot = allPossibilitiesAfterQuestion.map(p => `${beforeQuestion}.${p}`);
    return [...withHash, ...withDot];
  } else {
    return [string];
  }
};

export const question = async () => {
  const lines = await readFileLines(`${ROOT_DIR_2023}Q12/input.txt`);
  const rows = [];
  lines.forEach(line => {
    console.log(line);
    const split = line.split(' ');
    let oneFifthOriginal = split[0]
    let oneFifthGroups = split[1];
    rows.push({
      original: oneFifthOriginal,
      groups: parseGroupsArray(oneFifthGroups),
      allPossibilities: getAllPossibilities(oneFifthOriginal)
    });
  });

  let sum = 0;

  rows.forEach(row => {
    const rule = row.groups;
    const matches = row.allPossibilities.filter(p => {
      const groups = p.replaceAll(/\.+/g, '.').split('.').filter(g => g.length !== 0);
      const lengths = groups.map(g => g.length);
      if (lengths.length === rule.length) {
        let allSame = true;
        for (let i = 0; i < lengths.length; i++) {
          if (lengths[i] !== rule[i]) {
            allSame = false;
          }
        }
        return allSame;
      } else {
        return false;
      }
    });
    sum += matches.length;
  });

  console.log(sum);

  return Promise.resolve();
};

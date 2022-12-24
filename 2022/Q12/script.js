import {readFile} from 'node:fs/promises';

const LETTERS = 'abcdefghijklmnopqrstuvwxyz'.split('');
const isLegalLetterStep = (letterFrom, letterTo) => {
  if (letterTo === undefined) {
    return false;
  }

  if (letterFrom === 'S') {
    letterFrom = 'a'
  }

  if (letterFrom === 'E') {
    letterFrom = 'z'
  }

  if (letterTo === 'S') {
    letterTo = 'a'
  }

  if (letterTo === 'E') {
    letterTo = 'z'
  }

  const fromIndex = LETTERS.indexOf(letterFrom);
  const toIndex = LETTERS.indexOf(letterTo);

  if (fromIndex === -1 || toIndex === -1) {
    throw 'error';
  }

  return toIndex === fromIndex -1 || toIndex >= fromIndex ;
}

const historyContainsCandidate = (history, candidate) => {
  return history.filter(h => {
    return h.up === candidate.up && h.right === candidate.right
  }).length > 0;
}

const getCandidates = fromXY => [{
  // right
  up: fromXY.up,
  right: fromXY.right + 1,
}, {
  // left
  up: fromXY.up,
  right: fromXY.right - 1,
}, {
  // above
  up: fromXY.up + 1,
  right: fromXY.right,
}, {
  // below
  up: fromXY.up - 1,
  right: fromXY.right,
}];

const shortestPath = (config, fromXY, toXY) => {
  if (toXY.letter !== 'S') {
    throw 'error';
  }

  if (fromXY.up === toXY.up && fromXY.right === toXY.right) {
    return [];
  } else {
    let shortestCandidatePath = [];
    getCandidates(fromXY).forEach(candidate => {
      const row = config.grid[candidate.up];
      if (row !== undefined) {
        const currentLetter = config.grid[fromXY.up][fromXY.right];
        const candidateLetter = row[candidate.right];
        candidate.letter = candidateLetter;
        if (isLegalLetterStep(currentLetter, candidateLetter)) {
          if (!historyContainsCandidate(config.history, candidate)) {
            const path = shortestPath({
              ...config,
              history: [...config.history, fromXY]
            }, candidate, toXY);
            if (path.length < shortestCandidatePath.length || shortestCandidatePath.length === 0) {
              shortestCandidatePath = path;
            }
          }
        }
      }
    })

    return [fromXY, ...shortestCandidatePath];
  }
}

const run = async () => {
  const contents = await readFile('./2022/Q12/input.txt', { encoding: 'utf8' });
  const lines = contents.split('\n')
  const grid = [];
  const startXY = {
    up: 0,
    right: 0,
    letter: 'S'
  }
  const endXY = {
    up: 0,
    right: 0,
    letter: 'E'
  }
  lines.forEach((line) => {
    if (line.trim() === '') {
      // do nothing.
    } else {
      grid.unshift(line.trim().split(''));
    }
  });
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (grid[i][j] === 'S') {
        startXY.up = i
        startXY.right = j;
      }
      if (grid[i][j] === 'E') {
        endXY.up = i
        endXY.right = j;
      }
    }
  }

  const shortest = shortestPath({
    grid: grid,
    history: []
  }, endXY, startXY)

  shortest.reverse();

  const path = [startXY, ...shortest];
  console.log(path)
  console.log(path.map(p => p.letter).join(''))
  console.log(path.length - 1)
}

run();

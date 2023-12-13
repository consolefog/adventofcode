import {readFileLines} from '../utils/readFileLines.js';
import {ROOT_DIR_2023} from '../utils/consts.js';

const parsePuzzlesArray = lines => {
  let puzzleRows = [];
  const puzzles = [];
  lines.forEach(line => {
    if (line !== '') {
      puzzleRows.push(line);
    } else {
      if (puzzleRows.length > 0) {
        puzzles.push([...puzzleRows]);
      }
      puzzleRows = [];
    }
  });

  if (puzzleRows.length > 0) {
    puzzles.push([...puzzleRows]);
  }
  return puzzles;
};

const solvePuzzle = (puzzle, bannedScore, type) => {
  const puzzleLength = puzzle.length;
  const mirrorPairs = [];
  for (let i = 1; i < puzzleLength; i++) {
    let rowsToCheck;
    if (i < puzzleLength / 2) {
      rowsToCheck = i;
    } else {
      rowsToCheck = puzzleLength - i;
    }
    mirrorPairs.push({
      indexAbove: i - 1,
      indexBelow: i,
      rowsToCheck: rowsToCheck,
      score: i,
      type: type,
    });
  }

  const validMirrorPairs = mirrorPairs.filter(mirrorPair => {
    let mirror = true;
    for (let i = 0; i < mirrorPair.rowsToCheck; i++) {
      if (puzzle[mirrorPair.indexAbove - i] !== puzzle[mirrorPair.indexBelow + i]) {
        mirror = false;
        break;
      }
    }
    return mirror;
  });

  if (validMirrorPairs.length === 0) {
    return undefined;
  }

  let bestMirrorPair = undefined;

  validMirrorPairs.forEach(mirrorPair => {
    if (bestMirrorPair === undefined) {
      if (bannedScore === undefined) {
        bestMirrorPair = mirrorPair;
      } else {
        if (!isSameScore(bannedScore, mirrorPair)) {
          bestMirrorPair = mirrorPair;
        }
      }
    } else {
      if (mirrorPair.rowsToCheck > bestMirrorPair.rowsToCheck) {
        if (bannedScore === undefined) {
          bestMirrorPair = mirrorPair;
        } else {
          if (!isSameScore(bannedScore, mirrorPair)) {
            bestMirrorPair = mirrorPair;
          }
        }
      }
    }
  });

  return bestMirrorPair;
};

const rotate = (puzzle) => {
  const rotated = [];

  const split = puzzle.map(l => l.split(''));

  for (let i = 0; i < split[0].length; i++) {
    rotated[i] = split.map(s => s[i]).reverse().join('');
  }

  return rotated;
};

const getPuzzleScore = (puzzle, bannedScore) => {
  let asRows = solvePuzzle(puzzle, bannedScore, 'row');
  if (asRows !== undefined) {
    return {
      ...asRows,
    };
  } else {
    let asColumns = solvePuzzle(rotate(puzzle), bannedScore, 'column');
    if (asColumns !== undefined) {
      return {
        ...asColumns,
      };
    } else {
      return undefined;
    }
  }
};

const unSmudgePuzzle = (puzzle, x, y) => {
  const splits = [...puzzle].map(l => l.split(''));
  const current = splits[y][x];
  if (current === '.') {
    splits[y][x] = '#';
  } else {
    splits[y][x] = '.';
  }
  return splits.map(s => s.join(''));
};

const isSameScore = (puzzleScore, bannedScore) => {
  return puzzleScore.type === bannedScore.type
    && puzzleScore.indexAbove === bannedScore.indexAbove
    && puzzleScore.indexBelow === bannedScore.indexBelow;
};

const puzzleScoreToNum = (puzzleScore) => {
  if (puzzleScore.type === 'column') {
    return puzzleScore.score;
  } else {
    return puzzleScore.score * 100;
  }
}

export const question = async () => {
  const lines = await readFileLines(`${ROOT_DIR_2023}Q13/input.txt`, true);
  const puzzles = parsePuzzlesArray(lines);

  let sum = 0;
  let part1Sum = 0;

  puzzles.forEach(puzzle => {
    const bannedScore = getPuzzleScore(puzzle, undefined);
    part1Sum += puzzleScoreToNum(bannedScore);
    const puzzleWidth = puzzle[0].length;
    const puzzleHeight = puzzle.length;
    let found = false;
    let totalSearched = 0;
    for (let y = 0; y < puzzleHeight && !found; y++) {
      for (let x = 0; x < puzzleWidth && !found; x++) {
        let unSmudgedAtXY = unSmudgePuzzle(puzzle, x, y);
        let puzzleScore = getPuzzleScore(unSmudgedAtXY, bannedScore);
        if (puzzleScore !== undefined && !isSameScore(puzzleScore, bannedScore)) {
          sum += puzzleScoreToNum(puzzleScore);
          found = true;
        }
        totalSearched++;
      }
    }
  });

  console.log('part 2', sum, 'part 1', part1Sum);

  return Promise.resolve();
};

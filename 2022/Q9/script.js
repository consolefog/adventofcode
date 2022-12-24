import {readFile} from 'node:fs/promises';

const areHandTAdjacent = (position) => {
  const rowDiff = position.h.right - position.t.right;
  const colDiff = position.h.up - position.t.up;
  const rowDiffAbs = Math.abs(rowDiff);
  const colDiffAbs = Math.abs(colDiff);
  return !(rowDiffAbs > 1 || colDiffAbs > 1);
}

const fixTail = (tailLogger, position) => {
  if (areHandTAdjacent(position)) {
    return false;
  }

  const rowDiff = position.h.right - position.t.right;
  const colDiff = position.h.up - position.t.up;
  const rowDiffAbs = Math.abs(rowDiff);
  const colDiffAbs = Math.abs(colDiff);

  if (rowDiffAbs > 0) {
    // fix horizontal
    if (rowDiff > 0) {
      position.t.right = position.t.right + 1;
    } else {
      position.t.right = position.t.right - 1;
    }
  }

  if (colDiffAbs > 0) {
    // fix vertical
    if (colDiff > 0) {
      position.t.up = position.t.up + 1;
    } else {
      position.t.up = position.t.up - 1;
    }
  }

  tailLogger.record(position.t);

  return true;
}

const toString = position => `H(${position.h.right},${position.h.up}) T(${position.t.right},${position.t.up})`;

const rightOnce = (tailLogger, position) => {
  position.h.right = position.h.right + 1;
  fixTail(tailLogger, position);
}
const upOnce = (tailLogger, position) => {
  position.h.up = position.h.up + 1;
  fixTail(tailLogger, position);
}

const leftOnce = (tailLogger, position) => {
  position.h.right = position.h.right - 1;
  fixTail(tailLogger, position);
}
const downOnce = (tailLogger, position) => {
  position.h.up = position.h.up - 1;
  fixTail(tailLogger, position);
}

const createPair = () => {
  return {
    h: {
      up: 0,
      right: 0
    },
    t: {
      up: 0,
      right: 0
    }
  };
}

const run = async () => {
  const tenKnots = [
    createPair(),
    createPair(),
    createPair(),
    createPair(),
    createPair(),
    createPair(),
    createPair(),
    createPair(),
    createPair(),
  ]

  const contents = await readFile('./2022/Q9/input.txt', {encoding: 'utf8'});
  const lines = contents.split('\n');
  const tailVisited = new Set(['0-0']);
  lines.forEach((line) => {
    if (line.trim() === '') {
      // do nothing.
    } else {
      const [direction, amount] = line.split(' ');
      const amountNumber = parseInt(amount);

      for (let i = 0; i < amountNumber; i++) {
        const operation = {
          'R': rightOnce,
          'L': leftOnce,
          'U': upOnce,
          'D': downOnce,
        }[direction];

        const noOpTailLogger = {
          record: (tail) => {
            // ignore
          }
        };

        const activeTailLogger = {
          record: (tail) => {
            tailVisited.add(`${tail.right}-${tail.up}`);
          }
        }

        operation(noOpTailLogger, tenKnots[0]);

        for (let i = 1; i < tenKnots.length; i++) {
          tenKnots[i].h = {
            ...tenKnots[i - 1].t
          }
          const isLast = i === tenKnots.length - 1;
          let moreFixingNeeded = true;
          while(moreFixingNeeded) {
            moreFixingNeeded = fixTail(isLast ? activeTailLogger : noOpTailLogger, tenKnots[i])
          }
        }
      }
    }
  });

  console.log(tailVisited.size);
}

run();

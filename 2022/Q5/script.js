import { readFile } from 'node:fs/promises';

/*

[G]                 [D] [R]
[W]         [V]     [C] [T] [M]
[L]         [P] [Z] [Q] [F] [V]
[J]         [S] [D] [J] [M] [T] [V]
[B]     [M] [H] [L] [Z] [J] [B] [S]
[R] [C] [T] [C] [T] [R] [D] [R] [D]
[T] [W] [Z] [T] [P] [B] [B] [H] [P]
[D] [S] [R] [D] [G] [F] [S] [L] [Q]
 1   2   3   4   5   6   7   8   9

 */

const iterateOnStacks = (currentStacks, instructions) => {
  const numCrates = instructions.numCrates;
  const fromIndexStr = instructions.fromIndexStr;
  const toIndexStr = instructions.toIndexStr;

  for (let i = 0; i < numCrates; i++) {
    const fromStack = currentStacks[fromIndexStr];
    const last = fromStack.pop();
    currentStacks[toIndexStr].push(last);
  }
}

const iterateOnStacks9001 = (currentStacks, instructions) => {
  const numCrates = instructions.numCrates;
  const fromIndexStr = instructions.fromIndexStr;
  const toIndexStr = instructions.toIndexStr;

  const createsMovingAllAtOnce = [];

  for (let i = 0; i < numCrates; i++) {
    const fromStack = currentStacks[fromIndexStr];
    const last = fromStack.pop();
    createsMovingAllAtOnce.push(last);
  }

  for (let j = createsMovingAllAtOnce.length - 1; j >=0; j--) {
    currentStacks[toIndexStr].push(createsMovingAllAtOnce[j]);
  }
}

const run = async () => {
  const contents = await readFile('./2022/Q5/input.txt', { encoding: 'utf8' });
  const lines = contents.split('\n')
  let stacks = {
    ['1']: ['D', 'T', 'R', 'B', 'J', 'L', 'W', 'G'],
    ['2']: ['S', 'W', 'C'],
    ['3']: ['R', 'Z', 'T', 'M'],
    ['4']: ['D', 'T', 'C', 'H', 'S', 'P', 'V'],
    ['5']: ['G', 'P', 'T', 'L', 'D', 'Z'],
    ['6']: ['F', 'B', 'R', 'Z', 'J', 'Q', 'C', 'D'],
    ['7']: ['S', 'B', 'D', 'J', 'M', 'F', 'T', 'R'],
    ['8']: ['L', 'H', 'R', 'B', 'T', 'V', 'M'],
    ['9']: ['Q', 'P', 'D', 'S', 'V'],
  }

  lines.forEach((line) => {
    if (line.trim() === '') {
      // do nothing.
    } else {
      const match = line.match(/move (\d+) from (\d+) to (\d+)/)
      const numCrates = match[1];
      const fromIndex = match[2];
      const toIndex = match[3];
      iterateOnStacks(stacks, {
        numCrates: parseInt(numCrates, 10),
        fromIndexStr: fromIndex,
        toIndexStr: toIndex
      });
    }
  });
  console.log(
    stacks['1'].pop() +
    stacks['2'].pop() +
    stacks['3'].pop() +
    stacks['4'].pop() +
    stacks['5'].pop() +
    stacks['6'].pop() +
    stacks['7'].pop() +
    stacks['8'].pop() +
    stacks['9'].pop()
  );
}

const part2 = async () => {
  const contents = await readFile('./2022/Q5/input.txt', { encoding: 'utf8' });
  const lines = contents.split('\n')
  let stacks = {
    ['1']: ['D', 'T', 'R', 'B', 'J', 'L', 'W', 'G'],
    ['2']: ['S', 'W', 'C'],
    ['3']: ['R', 'Z', 'T', 'M'],
    ['4']: ['D', 'T', 'C', 'H', 'S', 'P', 'V'],
    ['5']: ['G', 'P', 'T', 'L', 'D', 'Z'],
    ['6']: ['F', 'B', 'R', 'Z', 'J', 'Q', 'C', 'D'],
    ['7']: ['S', 'B', 'D', 'J', 'M', 'F', 'T', 'R'],
    ['8']: ['L', 'H', 'R', 'B', 'T', 'V', 'M'],
    ['9']: ['Q', 'P', 'D', 'S', 'V'],
  }

  lines.forEach((line) => {
    if (line.trim() === '') {
      // do nothing.
    } else {
      const match = line.match(/move (\d+) from (\d+) to (\d+)/)
      const numCrates = match[1];
      const fromIndex = match[2];
      const toIndex = match[3];
      iterateOnStacks9001(stacks, {
        numCrates: parseInt(numCrates, 10),
        fromIndexStr: fromIndex,
        toIndexStr: toIndex
      });
    }
  });
  console.log(
    stacks['1'].pop() +
    stacks['2'].pop() +
    stacks['3'].pop() +
    stacks['4'].pop() +
    stacks['5'].pop() +
    stacks['6'].pop() +
    stacks['7'].pop() +
    stacks['8'].pop() +
    stacks['9'].pop()
  );
}

part2();

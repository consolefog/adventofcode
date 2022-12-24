import { readFile } from 'node:fs/promises';

const scoreLetter = (letter) => {
  return 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').indexOf(letter) + 1;
}

const run = async () => {
  const contents = await readFile('./2022/Q3/input.txt', { encoding: 'utf8' });
  const lines = contents.split('\n')
  let totalScore = 0;
  lines.forEach((line) => {
    if (line.trim() === '') {
      // do nothing.
    } else {
      const trimmed = line.trim();
      const length = trimmed.length / 2;
      const first = trimmed.substring(0, length);
      const second = trimmed.substring(length, trimmed.length);
      const firstSet = new Set(first.split(''));
      const secondSet = new Set(second.split(''));
      const intersect = new Set([...firstSet].filter(i => secondSet.has(i)));
      const sharedLetter = [...intersect][0]
      totalScore += scoreLetter(sharedLetter);
      console.log(sharedLetter);
    }
  });
  console.log(totalScore);
}

const part2 = async () => {
  const contents = await readFile('./2022/Q3/input.txt', { encoding: 'utf8' });
  const lines = contents.split('\n')
  let totalScore = 0;
  let threeLines = [];
  lines.forEach((line) => {
    if (line.trim() === '') {
      // do nothing.
    } else {
      if (threeLines.length === 2) {
        threeLines.push(line.trim());
        const firstSet = new Set(threeLines[0].split(''));
        const secondSet = new Set(threeLines[1].split(''));
        const thirdSet = new Set(threeLines[2].split(''));
        const intersect = new Set([...firstSet]
          .filter(i => secondSet.has(i))
          .filter(i => thirdSet.has(i)));
        const sharedLetter = [...intersect][0];
        totalScore += scoreLetter(sharedLetter);
        threeLines = [];
        // console.log(sharedLetter);
      } else {
        threeLines.push(line.trim());
      }
    }
  });
  console.log(totalScore);
}

part2();

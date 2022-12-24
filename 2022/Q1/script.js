import { readFile } from 'node:fs/promises';

const run = async () => {
    const contents = await readFile('./2022/Q1/input.txt', { encoding: 'utf8' });
    const lines = contents.split('\n')
    let currentSum = 0;
    let bestSum = 0;
    let allSums = [];
    lines.forEach((line) => {
      if (line.trim() === '') {
        allSums.push(currentSum);
        bestSum = Math.max(bestSum, currentSum);
        currentSum = 0;
      } else {
        currentSum += parseInt(line, 10);
      }
    })
    console.log(allSums.join(', '));
    console.log(bestSum);
}

const part2 = async () => {
  const contents = await readFile('./2022/Q1/input.txt', { encoding: 'utf8' });
  const lines = contents.split('\n')
  let currentSum = 0;
  let allSums = [];
  lines.forEach((line) => {
    if (line.trim() === '') {
      allSums.push(currentSum);
      currentSum = 0;
    } else {
      currentSum += parseInt(line, 10);
    }
  })
  allSums.sort((a, b) => {
    if (a === b) return 0;
    if (a < b) return -1;
    return 1;
  });
  console.log(allSums[allSums.length - 1] + allSums[allSums.length - 2] + allSums[allSums.length - 3]);
}

part2();

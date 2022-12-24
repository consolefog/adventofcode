import { readFile } from 'node:fs/promises';

const rangeStringToStartEnd = (rangeString) => {
  const [from, to] = rangeString.split('-');
  return {
    start: parseInt(from, 10),
    end: parseInt(to, 10),
  }
}

const run = async () => {
  const contents = await readFile('./2022/Q4/input.txt', { encoding: 'utf8' });
  const lines = contents.split('\n')
  let totalScore = 0;
  lines.forEach((line) => {
    if (line.trim() === '') {
      // do nothing.
    } else {
      const [sectionRangeA, sectionRangeB] = line.trim().split(',')
      const startEndA = rangeStringToStartEnd(sectionRangeA);
      const startEndB = rangeStringToStartEnd(sectionRangeB);

      const asIsContainedInsideB = startEndA.start >= startEndB.start
        && startEndA.end <= startEndB.end;
      const bsIsContainedInsideA = startEndB.start >= startEndA.start
        && startEndB.end <= startEndA.end;
      if (asIsContainedInsideB || bsIsContainedInsideA) {
        totalScore += 1;
      }
    }
  });
  console.log(totalScore);
}

const part2 = async () => {
  const contents = await readFile('./2022/Q4/input.txt', { encoding: 'utf8' });
  const lines = contents.split('\n')
  let totalScore = 0;
  lines.forEach((line) => {
    if (line.trim() === '') {
      // do nothing.
    } else {
      const [sectionRangeA, sectionRangeB] = line.trim().split(',')
      const startEndA = rangeStringToStartEnd(sectionRangeA);
      const startEndB = rangeStringToStartEnd(sectionRangeB);

      const endOfA = startEndA.end;
      const endOfB = startEndB.end;

      const startOfA = startEndA.start;
      const startOfB = startEndB.start;

      const aEndsInsideB = endOfA >= startOfB && endOfA <= endOfB
      const aStartsInsideB = startOfA >= startOfB && startOfA <= endOfB
      const bIsFullyInA = startOfA <= startOfB && endOfB <= endOfA

      if (aEndsInsideB || aStartsInsideB || bIsFullyInA) {
        totalScore += 1;
      }
    }
  });
  console.log(totalScore);
}

part2();

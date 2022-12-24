import { readFile } from 'node:fs/promises';

const run = async () => {
  const contents = await readFile('./2022/Q22/input.txt', { encoding: 'utf8' });
  const lines = contents.split('\n')
  let totalScore = 0;
  lines.forEach((line) => {
    if (line.trim() === '') {
      // do nothing.
    } else {
      // todo.
    }
  });
  console.log(totalScore);
}

run();

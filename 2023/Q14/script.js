import {readFileLines} from '../utils/readFileLines.js';
import {ROOT_DIR_2023} from '../utils/consts.js';

export const question = async () => {
  const lines = await readFileLines(`${ROOT_DIR_2023}Q14/input.txt`);
  lines.forEach(line => {
    console.log(line);
  });

  return Promise.resolve();
};

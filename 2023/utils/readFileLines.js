import {readFile} from 'node:fs/promises';

export const readFileLines = async filePath => {
  const contents = await readFile(filePath, {encoding: 'utf8'});
  return contents.split('\n').map(line => line.trim()).filter(line => line !== '');
};

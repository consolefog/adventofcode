import {readFile} from 'node:fs/promises';

export const readFileLines = async (filePath, dontFilterEmpty = false) => {
  const contents = await readFile(filePath, {encoding: 'utf8'});
  return contents.split('\n').map(line => line.trim()).filter(line => {
    if (dontFilterEmpty) {
      return true;
    } else {
      return line !== '';
    }
  });
};

import {readFileLines} from '../utils/readFileLines.js';
import {ROOT_DIR_2023} from '../utils/consts.js';

const differenceRow = (arr) => {
  const differenceArray = [];
  for (let i = 1; i < arr.length; i++) {
    differenceArray.push(arr[i] - arr[i - 1]);
  }
  return differenceArray;
};

const hasSomeNonZero = (arr) => {
  return arr.some(n => n !== 0);
};

export const question = async () => {
  const filePath = `${ROOT_DIR_2023}Q9/input.txt`;
  let sum = 0;
  (await readFileLines(filePath))
    .forEach(rowOfIntegers => {
      let row = rowOfIntegers
        .split(' ')
        .map(n => n.trim())
        .map(n => parseInt(n, 10));
      const allRows = [];
      while (hasSomeNonZero(row)) {
        allRows.push([...row]);
        row = differenceRow(row);
      }
      allRows.push(row); // all zeros row
      const zerosRowIndex = allRows.length - 1;
      for (let rowIndex = zerosRowIndex; rowIndex >= 0; rowIndex--) {
        if (rowIndex === zerosRowIndex) {
          allRows[rowIndex].unshift(0);
        } else {
          const firstNumberThisRow = allRows[rowIndex][0];
          const firstNumberNextRow = allRows[rowIndex + 1][0];
          allRows[rowIndex].unshift(firstNumberThisRow - firstNumberNextRow);
        }
      }
      sum += allRows[0][0];
    });
  console.log(sum);
  return Promise.resolve();
};

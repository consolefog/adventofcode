import {readFileLines} from '../utils/readFileLines.js';
import {ROOT_DIR_2023} from '../utils/consts.js';

const firstIndexOf = (line, substring) => {
  return line.indexOf(substring);
}

const lastIndexOf = (line, substring) => {
  let reversedLine = line.split("").reverse().join("");
  let reversedSubstring = substring.split("").reverse().join("");
  return reversedLine.indexOf(reversedSubstring);
}

const options = [
  {
    number: 1,
    asString: '1',
    asWord: 'one'
  },
  {
    number: 2,
    asString: '2',
    asWord: 'two'
  },
  {
    number: 3,
    asString: '3',
    asWord: 'three'
  },
  {
    number: 4,
    asString: '4',
    asWord: 'four'
  },
  {
    number: 5,
    asString: '5',
    asWord: 'five'
  },
  {
    number: 6,
    asString: '6',
    asWord: 'six'
  },
  {
    number: 7,
    asString: '7',
    asWord: 'seven'
  },
  {
    number: 8,
    asString: '8',
    asWord: 'eight'
  },
  {
    number: 9,
    asString: '9',
    asWord: 'nine'
  },
]

const smallestNonNegative = (a, b) => {
  let retVal = a;
  if (retVal === -1 || (b !== -1 && b < retVal)) {
    retVal = b;
  }
  return retVal;
};

export const question = async () => {
  const lines = await readFileLines(`${ROOT_DIR_2023}Q1/input.txt`);
  let total = 0;
  lines.forEach(line => {
    const positions = {
      firstIndex: undefined,
      firstString: undefined,
      lastIndex: undefined,
      lastString: undefined,
    }

    let trimmed = line.trim();
    options.forEach(option => {
      const firstOneNumber = firstIndexOf(trimmed, option.asString);
      const firstOneString = firstIndexOf(trimmed, option.asWord);
      const isFoundFirst = firstOneString !== -1 || firstOneNumber !== -1;
      if (isFoundFirst) {
        let index = smallestNonNegative(firstOneNumber, firstOneString);
        if (positions.firstIndex === undefined || (index !== -1 && index < positions.firstIndex)) {
          positions.firstIndex = index;
          positions.firstString = option.asString;
        }
      }

      const lastOneNumber = lastIndexOf(trimmed, option.asString);
      const lastOneString = lastIndexOf(trimmed, option.asWord);
      const isFoundLast = lastOneNumber !== -1 || lastOneString !== -1;
      if (isFoundLast) {
        let index = smallestNonNegative(lastOneNumber, lastOneString);
        if (positions.lastIndex === undefined || (index !== -1 && index < positions.lastIndex)) {
          positions.lastIndex = index;
          positions.lastString = option.asString;
        }
      }
    });

    if (positions.lastIndex !== undefined) {
      let string = `${positions.firstString}${positions.lastString}`;
      const numberForThisLine = parseInt(string, 10);
      total += numberForThisLine;
    }

    console.log(line, positions);
  });

  console.log(total);

  return Promise.resolve();
};

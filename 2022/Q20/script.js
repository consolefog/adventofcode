import {readFile} from 'node:fs/promises';

const DECRYPTION_KEY = 811589153;

const mix = arr => {
  const copy = [...arr];
  const editing = [...arr];

  for (let i = 0; i < 10; i++) {
    console.log('mix #', i + 1);
    copy.forEach((value, originalIndex) => {
      const index = editing.findIndex(element => {
        return element.originalIndex === originalIndex
      });
      let next = {
        from: index,
        swapsLeftToDo: editing[index].swaps
      }
      while(next.swapsLeftToDo !== 0) {
        next = moveElementAtIndex(editing, next.from, next.swapsLeftToDo);
      }
    })
  }

  return editing
};

const runFile = async () => {
  const contents = await readFile('./2022/Q20/input.txt', { encoding: 'utf8' });
  const lines = contents.split('\n')
  const array = [];

  lines.forEach((line, originalIndex) => {
    if (line.trim() === '') {
      // do nothing.
    } else {
      const number = parseInt(line.trim(), 10);
      array.push({
        originalValue: number,
        originalIndex: originalIndex
      })
    }
  });

  array.forEach(item => {
    const mod = array.length - 1;
    let a = item.originalValue % mod;
    let b = DECRYPTION_KEY % mod;
    if (item.originalValue < 0) {
      let positiveValue = (a * b) % mod;
      while (positiveValue > 0) {
        positiveValue -= mod;
      }
      item.swaps = positiveValue;
    } else {
      item.swaps = ((a * b) % mod);
    }
  });

  const result = mix(array);
  console.log(result, result.length === array.length);
  const indexOfZero = result.findIndex(element => element.originalValue === 0)
  let a = result[(indexOfZero + 1000) % result.length];
  let b = result[(indexOfZero + 2000) % result.length];
  let c = result[(indexOfZero + 3000) % result.length];
  console.log((a.originalValue + b.originalValue + c.originalValue) * DECRYPTION_KEY);
}

const moveElementAtIndex = (arr, from, swapsLeftToDo) => {
  if (swapsLeftToDo === 0) {
    // do nothing
    return
  }

  if (from < 0 || from > arr.length - 1) {
    throw 'bad input';
  }

  if (swapsLeftToDo > 0) {
    // move one place to the 'right';
    if (from < arr.length - 1) {
      if (from === arr.length - 2) {
        const tmp = arr[arr.length - 2];
        arr.splice(arr.length - 2, 1);
        arr.unshift(tmp);
        return {
          from: 0,
          swapsLeftToDo: swapsLeftToDo - 1,
        }
      } else {
        const tmp = arr[from];
        arr[from] = arr[from + 1];
        arr[from + 1] = tmp;
        return {
          from: from + 1,
          swapsLeftToDo: swapsLeftToDo - 1,
        }
      }
    } else if (from === arr.length - 1) {
      const tmp = arr[from];
      arr.splice(arr.length - 1, 1)
      arr.unshift(tmp);
      return {
        from: 0,
        swapsLeftToDo: swapsLeftToDo,
      }
    }
  } else {
    // move one place to the 'left';
    if (from > 0) {
      if (from === 1) {
        const tmp = arr[1]
        arr.splice(1, 1);
        arr.push(tmp)
        return {
          from: arr.length - 1,
          swapsLeftToDo: swapsLeftToDo + 1,
        }
      } else {
        const tmp = arr[from];
        arr[from] = arr[from - 1];
        arr[from - 1] = tmp;
        return {
          from: from - 1,
          swapsLeftToDo: swapsLeftToDo + 1,
        }
      }
    } else if (from === 0) {
      const tmp = arr[from];
      arr.splice(0, 1);
      arr.push(tmp);
      return {
        from: arr.length - 1,
        swapsLeftToDo: swapsLeftToDo,
      }
    }
  }
}



const runDemo = () => {
  console.log(mix([1, 2, -3, 3, -2, 0, 4]));
}

runFile();
// runDemo();

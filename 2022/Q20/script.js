import {readFile} from 'node:fs/promises';

const mix = arr => {
  const copy = [...arr];

  const labels = [...arr].map((item, originalIndex) => {
    return `${item}:${originalIndex}`
  });

  copy.forEach((value, originalIndex) => {
    const label = labels.find(x => {
      return x.split(':')[1] === `${originalIndex}`
    });
    const index = labels.indexOf(label);
    let next = {
      from: index,
      swapsLeftToDo: parseInt(label.split(':')[0])
    }
    while(next.swapsLeftToDo !== 0) {
      next = moveElementAtIndex(labels, next.from, next.swapsLeftToDo);
    }
  })

  return labels.map(label => {
    return parseInt(label.split(':')[0], 10)
  })
};

const runFile = async () => {
  const contents = await readFile('./2022/Q20/input.txt', { encoding: 'utf8' });
  const lines = contents.split('\n')
  const array = [];
  lines.forEach((line) => {
    if (line.trim() === '') {
      // do nothing.
    } else {
      array.push(parseInt(line.trim(), 10))
    }
  });

  const result = mix(array);
  console.log(result, result.length === array.length);
  const indexOfZero = result.indexOf(0)
  let a = result[(indexOfZero + 1000) % result.length];
  let b = result[(indexOfZero + 2000) % result.length];
  let c = result[(indexOfZero + 3000) % result.length];
  console.log(a + b + c);
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

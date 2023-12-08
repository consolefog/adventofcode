import {readFileLines} from '../utils/readFileLines.js';
import {ROOT_DIR_2023} from '../utils/consts.js';

const endsInZ = (str) => {
  return str.slice(-1) === 'Z';
}

export const question = async () => {
  const lines = await readFileLines(`${ROOT_DIR_2023}Q8/input.txt`);
  let lrOrder;
  let map = {};
  let endsInA = [];
  lines.forEach(((line, index) => {
    if (index === 0) {
      // LLR
      lrOrder = line.split('');
    }
    if (line.includes('=')) {
      const fromAndLR = line.split(' = ');
      const from = fromAndLR[0];
      if (from.slice(-1) === 'A') {
        endsInA.push(from);
      }
      const LR = fromAndLR[1];
      const leftAndRight = LR.split(', ');
      let left = leftAndRight[0].substring(1);
      let right = leftAndRight[1].substring(0, 3);
      map[from] = {
        left: left,
        leftEndsInZ: endsInZ(left),
        right: right,
        rightEndInZ: endsInZ(right)
      };
    }
  }));

  let pointers = [...endsInA];
  let lrIndex = 0;
  let count = 0;
  console.log(pointers.length);
  console.log(pointers);
  console.log(map);
  let zCount = 0
  const timeToZ = [];
  const zSeen = [];
  pointers.forEach(() => {
    timeToZ.push(0);
    zSeen.push([])
  })
  while (timeToZ.some(t => t === 0)) {
    zCount = 0;
    const next = lrOrder[lrIndex];

    for (let i = 0; i < pointers.length; i++) {
      if (next === 'L') {
        if (map[pointers[i]].leftEndsInZ) {
          zCount++;
          if (timeToZ[i] === 0) {
            timeToZ[i] = count + 1;
          }
          zSeen[i].push(map[pointers[i]].left);
        }
        pointers[i] = map[pointers[i]].left;
      } else if (next === 'R') {
        if (map[pointers[i]].rightEndInZ) {
          zCount++;
          if (timeToZ[i] === 0) {
            timeToZ[i] = count + 1;
          }
          zSeen[i].push(map[pointers[i]].right);
        }
        pointers[i] = map[pointers[i]].right;
      } else {
        throw 'Error'
      }
    }

    count += 1;

    if (count % 1000000 === 0) {
      console.log(count, pointers, zSeen);
    }

    lrIndex = (lrIndex + 1) % lrOrder.length;
  }

  console.log(timeToZ);

  function gcd(a, b) {
    for (let temp = b; b !== 0;) {
      b = a % b;
      a = temp;
      temp = b;
    }
    return a;
  }

  function lcmFunction(a, b) {
    const gcdValue = gcd(a, b);
    return (a * b) / gcdValue;
  }

  let lcm = timeToZ[0];
  for (let i = 1; i < timeToZ.length; i++) {
    lcm = lcmFunction(lcm, timeToZ[i])
  }

  console.log(lcm, zSeen);

  return Promise.resolve();
};

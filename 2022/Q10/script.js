import { readFile } from 'node:fs/promises';

const logState = (cycleNum, X) => {
  if (cycleNum >= 20) {
    if ((cycleNum - 20) % 40 === 0) {
      const strength = cycleNum * X;
      return strength;
    }
  }

  return undefined;
}

const run = async () => {
  const contents = await readFile('./2022/Q10/input.txt', { encoding: 'utf8' });
  const lines = contents.split('\n')
  let cycleNum = 0;
  let X = 1;
  let totalStrength = 0;
  const crt = {
    row1: '........................................',
    row2: '........................................',
    row3: '........................................',
    row4: '........................................',
    row5: '........................................',
    row6: '........................................',
  }

  let sprite = '###.....................................';

  const getSpriteForX = (X) => {
    let sprite = '........................................';
    let arr = sprite.split('');
    arr[X] = '#';
    arr[X - 1] = '#';
    arr[X + 1] = '#';
    return arr.join('');
  }

  const updateCRT = (crt, sprite, cycleNum) => {
    let updating;
    let index;
    if (cycleNum >= 1 && cycleNum <= 40) {
      updating = 'row1';
      index = cycleNum - 1;
    } else if (cycleNum >= 41 && cycleNum <= 80) {
      updating = 'row2';
      index = cycleNum - 41;
    } else if (cycleNum >= 81 && cycleNum <= 120) {
      updating = 'row3';
      index = cycleNum - 81;
    } else if (cycleNum >= 121 && cycleNum <= 160) {
      updating = 'row4';
      index = cycleNum - 121;
    } else if (cycleNum >= 161 && cycleNum <= 200) {
      updating = 'row5';
      index = cycleNum - 161;
    } else if (cycleNum >= 201 && cycleNum <= 241) {
      updating = 'row6';
      index = cycleNum - 201;
    } else {
      throw 'error';
    }

    const currentCRTRow = crt[updating];
    const currentCRTRowArr = currentCRTRow.split(',');
    const spriteDraw = sprite.split('')[index];
    currentCRTRowArr[index] = spriteDraw === '#' ? '#' : '.';
    crt[updating] = currentCRTRowArr.join('');
  }

  lines.forEach((line) => {
    if (line.trim() === '') {
      // do nothing.
    } else {
      const trimmed = line.trim();
      if (trimmed.startsWith('noop')) {
        cycleNum += 1;
        totalStrength += logState(cycleNum, X) ?? 0;
        updateCRT(crt, sprite, cycleNum);
      } else {
        if (trimmed.startsWith('addx')) {
          const toAdd = parseInt(trimmed.split('addx ')[1]);
          cycleNum += 1;
          totalStrength += logState(cycleNum, X) ?? 0;
          updateCRT(crt, sprite, cycleNum);
          cycleNum += 1;
          totalStrength += logState(cycleNum, X) ?? 0;
          updateCRT(crt, sprite, cycleNum);
          X += toAdd;
          sprite = getSpriteForX(X);
        } else {
          throw 'error';
        }
      }
      // todo.
    }
  });
  console.log(crt.row1);
  console.log(crt.row2);
  console.log(crt.row3);
  console.log(crt.row4);
  console.log(crt.row5);
  console.log(crt.row6);
}

run();

import {readFile} from 'node:fs/promises';

const LETTERS = 'abcdefghijklmnopqrstuvwxyz'.split('');
const IS_DEMO = true;

const nodeFromXY = (xy, grid, parent) => {
  return {
    xy: xy,
    parent: parent,
    letter: grid[xy.up][xy.right],
    neighbors: [],
  }
}

const canMove = (fromLetter, toLetter) => {
  if (fromLetter === 'S') {
    fromLetter = 'a'
  }

  if (fromLetter === 'E') {
    fromLetter = 'z'
  }

  if (toLetter === 'S') {
    toLetter = 'a'
  }

  if (toLetter === 'E') {
    toLetter = 'z'
  }

  const fromIndex = LETTERS.indexOf(fromLetter);
  const toIndex = LETTERS.indexOf(toLetter);

  return toIndex - fromIndex <= 1;
}

const setNeighbors = (node, grid, seenNodes) => {
  const possiblyAddNeighbor = (newUp, newRight) => {
    const id = `${newUp}-${newRight}`;
    if (!seenNodes.has(id)) {
      const currentLetter = node.letter;
      const newLetter = grid[newUp][newRight];
      if (canMove(currentLetter, newLetter)) {
        seenNodes.add(id);
        const neighborXY = {up: newUp, right: newRight};
        const neighbor = nodeFromXY(neighborXY, grid, node);
        node.neighbors.push(neighbor);
      }
    }
  };

  const gridMaxUp = grid.length - 1;
  const gridMaxRight = grid[0].length - 1;

  if (node.xy.right < gridMaxRight) {
    possiblyAddNeighbor(node.xy.up, node.xy.right + 1);
  }

  if (node.xy.right > 0) {
    possiblyAddNeighbor(node.xy.up, node.xy.right - 1);
  }

  if (node.xy.up < gridMaxUp) {
    possiblyAddNeighbor(node.xy.up + 1, node.xy.right);
  }

  if (node.xy.up > 0) {
    possiblyAddNeighbor(node.xy.up - 1, node.xy.right);
  }
}

const buildGraph = (node, grid, seenNodes, eRecorder) => {
  setNeighbors(node, grid, seenNodes);
  if (node.neighbors.length !== 0) {
    node.neighbors.forEach(neighbor => {
      if (neighbor.letter === 'E') {
        eRecorder.value = neighbor;
      } else {
        buildGraph(neighbor, grid, seenNodes, eRecorder);
      }
    })
  }
}

const run = async () => {
  const contents = await readFile(IS_DEMO
    ? './2022/Q12/input-demo.txt'
    : './2022/Q12/input.txt', { encoding: 'utf8' });
  const lines = contents.split('\n')
  const grid = [];
  const startXY = {
    up: 0,
    right: 0,
    letter: 'S'
  }
  const endXY = {
    up: 0,
    right: 0,
    letter: 'E'
  }
  lines.forEach((line) => {
    if (line.trim() === '') {
      // do nothing.
    } else {
      grid.unshift(line.trim().split(''));
    }
  });
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (grid[i][j] === 'S') {
        startXY.up = i
        startXY.right = j;
      }
      if (grid[i][j] === 'E') {
        endXY.up = i
        endXY.right = j;
      }
    }
  }

  const seenNodes = new Set();
  const node = nodeFromXY(startXY, grid, undefined);
  const eRecorder = {
    value: undefined,
  }
  buildGraph(node, grid, seenNodes, eRecorder);

  const path = [];

  const E = eRecorder.value;

  if (E) {
    let current = E;
    while (current.parent !== undefined) {
      path.push(current.letter)
      current = current.parent;
    }
    path.push('S');
  }

  path.reverse();
  console.log(path.join(''))
  // num steps = num nodes - 1
  console.log(path.length - 1);
}

run();

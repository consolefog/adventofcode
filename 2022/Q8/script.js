import {readFile} from 'node:fs/promises';

const countVisibleTrees = (state, allRows, currentHeight) => {
  let itr = state.initialItr();
  while (state.outOfBoundsCheck(itr) && !itr.foundBigTree) {
    if (allRows[itr.row][itr.col] === currentHeight) {
      itr.treesVisibleInThisDirection += 1;
      itr.foundBigTree = true;
    } else if (allRows[itr.row][itr.col] < currentHeight) {
      itr.treesVisibleInThisDirection += 1;
      itr = state.iterate(itr);
    } else {
      itr.treesVisibleInThisDirection +=1;
      itr.foundBigTree = true;
    }
  }
  return itr.treesVisibleInThisDirection;
};

const run = async () => {
  const contents = await readFile('./2022/Q8/input.txt', {encoding: 'utf8'});
  const lines = contents.split('\n')
  const allRows = [];
  let bestScenicScore = 0;
  let bestDecision = {};
  lines.forEach((line) => {
    if (line.trim() === '') {
      // do nothing.
    } else {
      const trimmed = line.trim();
      const rowHeights = trimmed.split('').map(heightStr => parseInt(heightStr, 10));
      allRows.push(rowHeights);
    }
  });

  const allDecisions = [];
  const allHiddenDecisions = [];

  for (let rowIndex = 0; rowIndex < allRows.length; rowIndex++) {
    const currentRow = allRows[rowIndex];
    for (let colIndex = 0; colIndex < currentRow.length; colIndex++) {
      const currentHeight = currentRow[colIndex];
      const decision = {
        row: rowIndex,
        col: colIndex,
        isVisibleAbove: true,
        isVisibleBelow: true,
        isVisibleLeft: true,
        isVisibleRight: true,
        notTallerAdjacentTreesAbove: 0,
        notTallerAdjacentTreesBelow: 0,
        notTallerAdjacentTreesLeft: 0,
        notTallerAdjacentTreesRight: 0,
        scenicScore: 0,
      }

      const lookingLeft = {
        initialItr: () => ({
          debug: 'left',
          row: rowIndex,
          col: colIndex - 1,
          foundBigTree: false,
          treesVisibleInThisDirection: 0
        }),
        outOfBoundsCheck: (itr) => itr.col >= 0,
        iterate: (itr) => ({
          ...itr,
          col: itr.col - 1,
        })
      }

      const lookingRight = {
        initialItr: () => ({
          debug: 'right',
          row: rowIndex,
          col: colIndex + 1,
          foundBigTree: false,
          treesVisibleInThisDirection: 0
        }),
        outOfBoundsCheck: (itr) => itr.col < currentRow.length,
        iterate: (itr) => ({
          ...itr,
          col: itr.col + 1,
        })
      }

      const lookingAbove = {
        initialItr: () => ({
          debug: 'above',
          row: rowIndex - 1,
          col: colIndex,
          foundBigTree: false,
          treesVisibleInThisDirection: 0
        }),
        outOfBoundsCheck: (itr) => itr.row >= 0,
        iterate: (itr) => ({
          ...itr,
          row: itr.row - 1,
        })
      }

      const lookingBelow = {
        initialItr: () => ({
          debug: 'below',
          row: rowIndex + 1,
          col: colIndex,
          foundBigTree: false,
          treesVisibleInThisDirection: 0
        }),
        outOfBoundsCheck: (itr) => itr.row < allRows.length,
        iterate: (itr) => ({
          ...itr,
          row: itr.row + 1,
        })
      }

      // left
      decision.notTallerAdjacentTreesLeft = countVisibleTrees(lookingLeft, allRows, currentHeight);
      decision.notTallerAdjacentTreesRight = countVisibleTrees(lookingRight, allRows, currentHeight);
      decision.notTallerAdjacentTreesAbove = countVisibleTrees(lookingAbove, allRows, currentHeight);
      decision.notTallerAdjacentTreesBelow = countVisibleTrees(lookingBelow, allRows, currentHeight);

      decision.scenicScore =
        (
          decision.notTallerAdjacentTreesLeft *
          decision.notTallerAdjacentTreesRight *
          decision.notTallerAdjacentTreesAbove *
          decision.notTallerAdjacentTreesBelow
        )

      if (decision.scenicScore > bestScenicScore) {
        bestScenicScore = decision.scenicScore;
        bestDecision = decision;
      }

      for (let l = 0; l < colIndex; l++) {
        if (currentRow[l] >= currentHeight) {
          // hidden from left
          decision.isVisibleLeft = false
        }
      }

      for (let r = (currentRow.length - 1); r > colIndex; r--) {
        if (currentRow[r] >= currentHeight) {
          // hidden from right
          decision.isVisibleRight = false
        }
      }

      for (let a = 0; a < rowIndex; a++) {
        if (allRows[a][colIndex] >= currentHeight) {
          // hidden from above
          decision.isVisibleAbove = false
        }
      }

      for (let b = (allRows.length - 1); b > rowIndex; b--) {
        if (allRows[b][colIndex] >= currentHeight) {
          // hidden from above
          decision.isVisibleBelow = false
        }
      }

      allDecisions.push(decision);

      if (!decision.isVisibleLeft
        && !decision.isVisibleRight
        && !decision.isVisibleAbove
        && !decision.isVisibleBelow
      ) {
        allHiddenDecisions.push(decision);
      }
    }
  }

  console.log('best tree', bestDecision);
  console.log('visible trees', allDecisions.length - allHiddenDecisions.length);
}

run();

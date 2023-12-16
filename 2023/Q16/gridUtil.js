const isIndexInRange = (index, arrayLength) => {
  return index >= 0 && index < arrayLength;
};

const printPointsSeenAsciiArt = (grid, pointsSeen) => {
  const dimensions = getGridHeightAndWidth(grid);

  const art = [];
  for (let i = 0; i < dimensions.height; i++) {
    const row = [];
    for (let j = 0; j < dimensions.width; j++) {
      row.push('.');
    }
    art.push(row);
  }

  pointsSeen.forEach(point => {
    const split = point.split(',');
    const x = parseInt(split[0], 10);
    const y = parseInt(split[1], 10);
    art[y][x] = '#';
  });

  art.forEach(row => {
    console.log(row.join(''));
  });
};

export const getGridHeightAndWidth = (grid) => {
  const gridWidth = grid[0].length;
  const gridHeight = grid.length;
  return {
    height: gridHeight,
    width: gridWidth
  };
};

export const isOutOfBounds = (grid, point) => {
  const dimensions = getGridHeightAndWidth(grid);
  const xIndexOk = isIndexInRange(point.x, dimensions.width);
  const yIndexOk = isIndexInRange(point.y, dimensions.height);
  return !xIndexOk || !yIndexOk;
};

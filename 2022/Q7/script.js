import {readFile} from 'node:fs/promises';

const getSmallDirs = (name, dir, max) => {
  const smallDirs = [];
  if (dir.total <= max) {
    smallDirs.push({
      name: name,
      total: dir.total,
    })
  }

  for (let i = 0; i < dir.dirNames.length; i++) {
    const dirName = dir.dirNames[i];
    const subSmallDirs = getSmallDirs(`${name}${name === '' ? '' : '/'}${dirName}`, dir[dirName], max);
    subSmallDirs.forEach(smallDir => {
      smallDirs.push(smallDir);
    })
  }

  return smallDirs;
}

const getBigDirs = (name, dir, min) => {
  const bigDirs = [];
  if (dir.total >= min) {
    bigDirs.push({
      name: name,
      total: dir.total,
    })
  }

  for (let i = 0; i < dir.dirNames.length; i++) {
    const dirName = dir.dirNames[i];
    const subBigDirs = getBigDirs(`${name}${name === '' ? '' : '/'}${dirName}`, dir[dirName], min);
    subBigDirs.forEach(smallDir => {
      bigDirs.push(smallDir);
    })
  }

  return bigDirs;
}

const sumDirectory = (dir) => {
  let total = 0;
  for(let i = 0; i < dir['fileSizes'].length; i++) {
    total += dir['fileSizes'][i];
  }
  dir.dirNames.forEach(dirName => {
    const dirSum = sumDirectory(dir[dirName]);
    total += dirSum;
  });
  dir.total = total;
  return total;
}

const run = async () => {
  const contents = await readFile('./2022/Q7/input.txt', { encoding: 'utf8' });
  const lines = contents.split('\n')
  const directoryTree = {
    ['/']: {
      fileNames: [],
      fileSizes: [],
      dirNames: [],
    }
  }

  let currentPointer = ['/']

  lines.forEach((line) => {
    const lineTrimmed = line.trim();
    if (lineTrimmed === '') {
      // do nothing.
    } else {
      if (lineTrimmed.startsWith('$ cd')) {
        if (lineTrimmed === '$ cd /') {
          currentPointer = ['/'];
        } else {
          const newDirName = lineTrimmed.split('$ cd ')[1];
          if (newDirName === '..') {
            currentPointer.pop();
          } else {
            currentPointer.push(newDirName);
          }
        }
      } else {
        if (lineTrimmed.startsWith('$ ls')) {
          // do nothing
        } else {
            let depth = directoryTree;
            for (let i = 0; i < currentPointer.length; i++) {
              depth = depth[currentPointer[i]];
            }
            if (lineTrimmed.startsWith('dir')) {
              const dirName = lineTrimmed.split('dir ')[1];
              depth.dirNames.push(dirName);
              depth[dirName] = {
                fileNames: [],
                fileSizes: [],
                dirNames: []
              };
            } else {
              const [size, name] = lineTrimmed.split(' ');
              depth.fileSizes.push(parseInt(size, 10));
              depth.fileNames.push(name);
            }
          }
        }
      }
    });
  sumDirectory(directoryTree['/']);

  const upgradeSize = 30000000;
  const spaceRemaining = 70000000 - directoryTree['/'].total;
  const needToFreeUp = upgradeSize - spaceRemaining;

  const bigDirs = getBigDirs('', directoryTree['/'], needToFreeUp);

  let smallestBigDir = bigDirs[0];

  for (let i = 0; i < bigDirs.length; i++) {
    if (bigDirs[i].total < smallestBigDir.total) {
      smallestBigDir = bigDirs[i];
    }
  }

  console.log(smallestBigDir);
}

run();

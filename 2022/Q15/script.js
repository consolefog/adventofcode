import {readFile} from 'node:fs/promises';

const IS_DEMO = false;
const SEARCH_AREA_SIZE = IS_DEMO ? 20 : 4000000

const run = async () => {
  const path = IS_DEMO ? './2022/Q15/input-demo.txt' : './2022/Q15/input.txt';
  const contents = await readFile(path, { encoding: 'utf8' });
  const lines = contents.split('\n')
  const sensorData = [];
  lines.forEach((line) => {
    let trimmed = line.trim();
    if (trimmed === '') {
      // do nothing.
    } else {
      const match = trimmed.match(/Sensor at x=([-]?\d+), y=([-]?\d+): closest beacon is at x=([-]?\d+), y=([-]?\d+)/)
      if (match) {
        const data = {
          sensorX: parseInt(match[1], 10),
          sensorY: parseInt(match[2], 10),
          closestBeaconX: parseInt(match[3], 10),
          closestBeaconY: parseInt(match[4], 10),
        };

        data.beaconDistance =
          Math.abs(data.sensorX - data.closestBeaconX) +
          Math.abs(data.sensorY - data.closestBeaconY)

        sensorData.push(data)
      } else {
        throw 'parse error'
      }
    }
  });

  // search at distances of +1 to the boundary of each beacon.

  const pairsOfXY = [];

  sensorData.forEach(data => {
    const sensorPosition = {
      x: data.sensorX,
      y: data.sensorY,
    }

    const distance = data.beaconDistance + 1

    for (let xShift = -distance; xShift < distance; xShift++) {
      const yShiftBelow = -(distance - xShift);
      const yShiftAbove = (distance - xShift);
      let below = {
        x: sensorPosition.x + xShift,
        y: sensorPosition.y + yShiftBelow
      };
      let above = {
        x: sensorPosition.x + xShift,
        y: sensorPosition.y + yShiftAbove
      };
      if (below.x >= 0 && below.x <= SEARCH_AREA_SIZE && below.y >= 0 && below.y <= SEARCH_AREA_SIZE) {
        pairsOfXY.push(`${below.x}-${below.y}`);
      }
      if (above.x >= 0 && above.x <= SEARCH_AREA_SIZE && above.y >= 0 && above.y <= SEARCH_AREA_SIZE) {
        pairsOfXY.push(`${above.x}-${above.y}`);
      }
    }
  })

  pairsOfXY.forEach(p => {
    const [x, y] = p.split('-').map(n => parseInt(n, 10))

    const beaconHereInSensorData = sensorData.find(data => {
      return data.closestBeaconX === x && data.closestBeaconY === y
    }) !== undefined

    let beaconIsPossible = true;

    for (let s = 0; s < sensorData.length && beaconIsPossible; s++) {
      const data = sensorData[s];

      const distanceFromPointToSensor =
        Math.abs(data.sensorX - x) +
        Math.abs(data.sensorY - y)

      if (distanceFromPointToSensor <= data.beaconDistance) {
        if (!beaconHereInSensorData) {
          beaconIsPossible = false;
        }
      }
    }

    if (beaconIsPossible && !beaconHereInSensorData) {
      console.log(x, y, x*SEARCH_AREA_SIZE + y);
    }
  });
}

run();

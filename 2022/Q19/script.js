import {readFile} from 'node:fs/promises';

const Blueprint1 = {
  0: [4, 0, 0, 0],
  1: [2, 0, 0, 0],
  2: [3, 14, 0, 0],
  3: [2, 0, 7, 0],
};

const Blueprint2 = {
  0: [2, 0, 0, 0],
  1: [3, 0, 0, 0],
  2: [3, 8, 0, 0],
  3: [3, 0, 12, 0],
};


const getBuildNextChoices = (resources, prices) => {
  const robotNames = Object.keys(prices);
  const choices = robotNames.filter(robotName => {
    const resourcesClone = [...resources];
    const priceOfThisRobot = prices[robotName];
    return (resourcesClone[0] - priceOfThisRobot[0] >= 0) &&
      (resourcesClone[1] - priceOfThisRobot[1] >= 0) &&
      (resourcesClone[2] - priceOfThisRobot[2] >= 0) &&
      (resourcesClone[3] - priceOfThisRobot[3] >= 0);
  });
  return choices.map(x => parseInt(x, 10));
}

const incurCostOfBuild = (prices, robotIndex, resources) => {
  const resourcesClone = [...resources];
  const priceOfThisRobot = prices[robotIndex];
  resourcesClone[0] -= priceOfThisRobot[0];
  resourcesClone[1] -= priceOfThisRobot[1];
  resourcesClone[2] -= priceOfThisRobot[2];
  resourcesClone[3] -= priceOfThisRobot[3];
  return resourcesClone;
}

let best = 0;
let bestHistory = undefined;

const ORE = 0;
const CLAY = 1;
const OBSIDIAN = 2;
const GEODE = 3;

const buildRobotAndRecur = (prices, robotIndex, history, minutesRemaining, resources, robots, banned) => {
  // increase resources by the number of each robot
  resources[ORE] += robots[ORE];
  resources[CLAY] += robots[CLAY];
  resources[OBSIDIAN] += robots[OBSIDIAN];
  resources[GEODE] += robots[GEODE];

  if (robotIndex !== 9) {
    // complete build from previous minute
    resources = incurCostOfBuild(prices, robotIndex, resources);
    robots[robotIndex]++;
    if (robotIndex === GEODE) {
      // this geode robot will start contributing next minute
      history.push(minutesRemaining - 1);
    }
  }

  minutesRemaining--;

  if (minutesRemaining === 0) {
    let total = 0;
    history.forEach(h => {
      total += h;
    })
    if (total > best) {
      best = total;
      bestHistory = history;
    }
    return;
  }

  const buildNextChoices = getBuildNextChoices(resources, prices);

  if (buildNextChoices.includes(GEODE)) {
    buildRobotAndRecur(prices, GEODE, [...history], minutesRemaining, [...resources], [...robots], [])
  } else {
    buildNextChoices.forEach(choice => {
      if (!banned.includes(choice)) {
        buildRobotAndRecur(prices, choice, [...history], minutesRemaining, [...resources], [...robots], [])
      }
    })

    buildRobotAndRecur(prices, 9, [...history], minutesRemaining, [...resources], [...robots], buildNextChoices)
  }
};

const path = './2022/Q19/input.txt';
const run = async () => {
  const contents = await readFile(path, {encoding: 'utf8'});
  const lines = contents.split('\n')
  const allPrices = [];
  lines.forEach((line) => {
    let trimmed = line.trim();
    if (trimmed === '') {
      // do nothing.
    } else {
      const match = trimmed.match(/Blueprint (\d+): Each ore robot costs (\d+) ore. Each clay robot costs (\d+) ore. Each obsidian robot costs (\d+) ore and (\d+) clay. Each geode robot costs (\d+) ore and (\d+) obsidian./)
      if (match) {
        const prices = {
          [ORE]: [parseInt(match[2], 10), 0, 0, 0],
          [CLAY]: [parseInt(match[3], 10), 0, 0, 0],
          [OBSIDIAN]: [parseInt(match[4], 10), parseInt(match[5], 10), 0, 0],
          [GEODE]: [parseInt(match[6], 10), 0, parseInt(match[7], 10), 0],
        }

        console.log(`Blueprint ${match[1]}`, prices);
        allPrices.push(prices);
      } else {
        throw 'parse error'
      }
    }
  });

  let totalQualityLevel = 0;
  allPrices.forEach((prices, index) => {
    buildRobotAndRecur(prices, 9, [], 24, [0, 0, 0, 0], [1, 0, 0, 0], []);
    const qualityLevel = best * (index + 1);
    totalQualityLevel += qualityLevel
    console.log(`Blueprint ${index + 1}`, bestHistory, best, qualityLevel);
    best = 0;
    bestHistory = undefined;
  })

  console.log(new Date(), 'Total quality level', totalQualityLevel);
}

run();

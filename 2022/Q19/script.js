import {readFile} from 'node:fs/promises';

const IS_PART_1 = false;
const NUM_MINUTES = IS_PART_1 ? 24 : 32;

const ORE = 0;
const CLAY = 1;
const OBSIDIAN = 2;
const GEODE = 3;

let bestTotalGeodes = 0;

const getBuildNextChoices = (resources, prices) => {
  return Object.keys(prices).filter(type => {
    return (resources[ORE] - prices[type][ORE] >= 0) &&
      (resources[CLAY] - prices[type][CLAY] >= 0) &&
      (resources[OBSIDIAN] - prices[type][OBSIDIAN] >= 0) &&
      (resources[GEODE] - prices[type][GEODE] >= 0);
  }).map(type => parseInt(type, 10));
}

const buildRobotAndRecur = (blueprint, robotIndex, totalGeodes, minutesRemaining, resources, robots, banned) => {
  // increase resources by the number of each robot
  resources[ORE] += robots[ORE];
  resources[CLAY] += robots[CLAY];
  resources[OBSIDIAN] += robots[OBSIDIAN];
  resources[GEODE] += robots[GEODE];

  if (robotIndex !== undefined) {
    const resourcesRemaining = [...resources];
    resourcesRemaining[ORE] -= blueprint[robotIndex][ORE];
    resourcesRemaining[CLAY] -= blueprint[robotIndex][CLAY];
    resourcesRemaining[OBSIDIAN] -= blueprint[robotIndex][OBSIDIAN];
    resourcesRemaining[GEODE] -= blueprint[robotIndex][GEODE];
    resources = resourcesRemaining;
    robots[robotIndex]++;
    if (robotIndex === GEODE) {
      // this geode robot will start contributing next minute
      totalGeodes += (minutesRemaining - 1);
    }
  }

  minutesRemaining--;

  if (minutesRemaining === 0) {
    if (totalGeodes > bestTotalGeodes) {
      bestTotalGeodes = totalGeodes;
    }
    return;
  }

  const buildNextChoices = getBuildNextChoices(resources, blueprint);

  if (buildNextChoices.includes(GEODE)) {
    buildRobotAndRecur(blueprint, GEODE, totalGeodes, minutesRemaining, [...resources], [...robots], [])
  } else {
    buildNextChoices.forEach(choice => {
      if (!banned.includes(choice)) {
        buildRobotAndRecur(blueprint, choice, totalGeodes, minutesRemaining, [...resources], [...robots], [])
      }
    });

    if (buildNextChoices.length !== 3) {
      buildRobotAndRecur(blueprint, undefined, totalGeodes, minutesRemaining, [...resources], [...robots], buildNextChoices)
    }
  }
};


const parseBlueprints = async () => {
  const contents = await readFile('./2022/Q19/input.txt', {encoding: 'utf8'});
  const lines = contents.split('\n')
  const blueprints = [];
  lines.forEach((line) => {
    let trimmed = line.trim();
    if (trimmed === '') {
      // do nothing.
    } else {
      const match = trimmed.match(/Blueprint (\d+): Each ore robot costs (\d+) ore. Each clay robot costs (\d+) ore. Each obsidian robot costs (\d+) ore and (\d+) clay. Each geode robot costs (\d+) ore and (\d+) obsidian./)
      if (match) {
        blueprints.push({
          [ORE]: [parseInt(match[2], 10), 0, 0, 0],
          [CLAY]: [parseInt(match[3], 10), 0, 0, 0],
          [OBSIDIAN]: [parseInt(match[4], 10), parseInt(match[5], 10), 0, 0],
          [GEODE]: [parseInt(match[6], 10), 0, parseInt(match[7], 10), 0],
        });
      } else {
        throw 'parse error'
      }
    }
  });
  return blueprints;
};

(async () => {
  const blueprints = await parseBlueprints();
  let totalQualityLevel = 0;
  const results = (IS_PART_1 ? blueprints : blueprints.slice(0, 3)).map((blueprint, index) => {
    buildRobotAndRecur(blueprint, undefined, 0, NUM_MINUTES, [0, 0, 0, 0], [1, 0, 0, 0], []);
    totalQualityLevel += bestTotalGeodes * (index + 1)
    const mapped = bestTotalGeodes;
    console.log(`Blueprint ${index + 1}`, mapped);
    bestTotalGeodes = 0;
    return mapped;
  })

  if (IS_PART_1) {
    console.log('Sum of all quality levels', totalQualityLevel);
  } else {
    console.log('(# Geodes 1) * (# Geodes 2) * (# Geodes 3) =', results[0] * results[1] * results[2])
  }
})();

import {readFile} from 'node:fs/promises';
import {DEMO_DATA} from './DEMO_DATA.js';
import {timeBetweenValvesBFS} from './timeBetweenValvesBFS.js';

const IS_PART_TWO = true;
const MAX_ALLOWED_MINUTES = IS_PART_TWO ? 26 : 30;
const PARSE_FROM_FILE = true;

// Whatever the solution is it can, without loss of generality, be described
// by the order of the useful valves being turned on.
// that is, if BZ, ZR, TS, CC are the valves with flow > 0
// any solution can be described by e.g.
// AA-ZR-TS or
// AA-TS-CC-BZ or
// AA-ZR-CC etc.
//
// We always start at AA, so every path descriptor is AA followed by a
// series of turning on the useful valves.
//
// The travel time for a descriptor can be computed after the fact, but
// we will learn to only generate paths whose total travel time stays
// under 30 minutes due to scaling issues otherwise.
//
// routesPossibleInRemainingTime(30) returns an array of routes e.g.
// ['BB', 'CC', 'DD'] or
// ['CC', 'DD'] etc

const routesPossibleInRemainingTime = (previousValve, valveChoices, valves, timeLeft) => {
  const all = [];
  if (valveChoices.length === 1) {
    return [[valveChoices[0]]];
  }

  if (valveChoices.length === 0) {
    return [];
  }

  valveChoices.forEach(valveChoice => {
    const time = timeBetweenValvesBFS(previousValve, valveChoice, valves)

    if (timeLeft - time - 1 >= 0) {
      const remainingValveChoices = [...valveChoices];
      const index = remainingValveChoices.indexOf(valveChoice);
      remainingValveChoices.splice(index, 1);
      const possibilities = routesPossibleInRemainingTime(
        valveChoice, remainingValveChoices, valves, timeLeft - time - 1);
      possibilities.forEach(possibility => {
        all.push([valveChoice, ...possibility]);
      })
    } else {
      all.push([])
    }
  })

  return all;
}

const calculateBestRoute = (valvesAvailableToTurnOn, valves) => {
  const allValveRoutes = routesPossibleInRemainingTime('AA', valvesAvailableToTurnOn, valves, MAX_ALLOWED_MINUTES);

  let best = {
    name: undefined,
    totalFlow: undefined
  }

  allValveRoutes.forEach(valveRoute => {
    let previousValve = 'AA';
    let prettyName = `AA-${valveRoute.join('-')}`;

    let timeTaken = 0;
    let totalFlow = 0;

    valveRoute.forEach(valve => {
      const travelTime = timeBetweenValvesBFS(previousValve, valve, valves);
      timeTaken += travelTime;
      // turn on
      timeTaken += 1;
      const timeThisNodeStartedHelping = timeTaken
      const minutesThisValveHelped = MAX_ALLOWED_MINUTES - timeThisNodeStartedHelping;
      const totalFlowFromValve = valves[valve].flow * minutesThisValveHelped;
      previousValve = valve;
      totalFlow += totalFlowFromValve;
    });

    if (timeTaken <= MAX_ALLOWED_MINUTES
      && (best.name === undefined || totalFlow > best.totalFlow)) {
      best.name = prettyName;
      best.totalFlow = totalFlow;
    }
  })
  return best;
};

const run = async () => {
  // path can be summarized as a series of times when the flow ones are turned on

  let valves = DEMO_DATA

  if (PARSE_FROM_FILE) {
    // set false to run demo.
    const contents = await readFile('./2022/Q16/input.txt', { encoding: 'utf8' });
    const lines = contents.split('\n')
    const REGEX = /Valve ([^ ]+) has flow rate=(\d+); tunnels lead to valves ([^$]+)/;
    valves = {};
    lines.forEach((line) => {
      if (line.trim() === '') {
        // do nothing.
      } else {
        const trimmed = line.trim();
        const match = trimmed.match(REGEX)
        const name = match[1]
        const flow = parseInt(match[2], 10)
        const neighbors = match[3].split(', ')
        valves[name] = {
          neighbors: neighbors,
          flow: flow,
        }
      }
    });
  }

  console.log('valves parsed to be', valves);

  const keys = Object.keys(valves);
  const valvesWithNonZeroFlow = keys.filter(key => valves[key].flow > 0);

  if (!IS_PART_TWO) {
    console.log(calculateBestRoute(valvesWithNonZeroFlow, valves));
  } else {
    // best solo AA-CA-JF-LE-FP-YH-UX-AR-DM
    let combinedTotalBest = 0;

    const elephantsOptions = [...valvesWithNonZeroFlow];

    // this is the best path for one person with 26 minutes
    // calculated by running part 1 with 26 as the limit not 30.
    const me = ['TU', 'UK', 'EK', 'GW', 'JT']

    me.forEach(v => {
      const indexToRemove = elephantsOptions.indexOf(v);
      elephantsOptions.splice(indexToRemove, 1);
    })

    const myResponsibility = me;
    const elephantResponsibility = elephantsOptions;

    const myBest = calculateBestRoute(myResponsibility, valves);
    const elephantsBest = calculateBestRoute(elephantResponsibility, valves);

    const combinedTotalFlow = myBest.totalFlow + elephantsBest.totalFlow;

    console.log(myBest, elephantsBest);

    if (combinedTotalFlow > combinedTotalBest) {
      combinedTotalBest = combinedTotalFlow;
    }
    console.log(combinedTotalBest);
  }
}

run();

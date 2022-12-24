const MonkeyMathBasic = {
  createFromNumber: n => n,
  multiply: (mn, n) => mn * n,
  add: (mn, n) => mn + n,
  squared: (mn) => mn * mn,
  isDivisibleBy: (mn, n) => mn % n === 0,
  divide: (mn, n) => Math.floor(mn / n),
}

const PRIMES = [2, 3, 5, 7, 11, 13, 17, 19, 23];

const MonkeyMath = {
  createFromNumber: n => {
    const mn = {};

    PRIMES.forEach(prime => {
      mn[prime] = n % prime
    })

    console.log(mn);

    return mn;
  },
  multiply: (mn, n) => {
    PRIMES.forEach(prime => {
      mn[prime] = (mn[prime] * n) % prime
    });
    return mn;
  },
  add: (mn, n) => {
    PRIMES.forEach(prime => {
      mn[prime] = (mn[prime] + n) % prime
    });
    return mn;
  },
  squared: (mn) => {
    PRIMES.forEach(prime => {
      mn[prime] = (mn[prime] * mn[prime]) % prime
    });
    return mn;
  },
  isDivisibleBy: (mn, n) => {
    if (PRIMES.indexOf(n) === -1) {
      throw 'error';
    }
    return mn[`${n}`] === 0;
  },
  divide: (mn, n) => {
    throw 'error';
  },
}

const monkeysDemo = [
  {
    inspectCount: 0,
    items: [79, 98].map(n => MonkeyMath.createFromNumber(n)),
    operation: mn => MonkeyMath.multiply(mn, 19),
    test: mn => MonkeyMath.isDivisibleBy(mn, 23) ? 2 : 3
  },
  {
    inspectCount: 0,
    items: [54, 65, 75, 74].map(n => MonkeyMath.createFromNumber(n)),
    operation: mn => MonkeyMath.add(mn, 6),
    test: mn => MonkeyMath.isDivisibleBy(mn, 19) > 0 ? 2 : 0
  },
  {
    inspectCount: 0,
    items: [79, 60, 97].map(n => MonkeyMath.createFromNumber(n)),
    operation: mn => MonkeyMath.squared(mn),
    test: mn => MonkeyMath.isDivisibleBy(mn, 13) ? 1 : 3
  },
  {
    inspectCount: 0,
    items: [74].map(n => MonkeyMath.createFromNumber(n)),
    operation: mn => MonkeyMath.add(mn, 3),
    test: mn => MonkeyMath.isDivisibleBy(mn, 17) ? 0 : 1
  },
];

const monkeysActual = [
  // Monkey 0:
  {
    inspectCount: 0,
    items: [59, 65, 86, 56, 74, 57, 56].map(n => MonkeyMath.createFromNumber(n)),
    operation: mn => MonkeyMath.multiply(mn, 17),
    test: mn => MonkeyMath.isDivisibleBy(mn, 3) ? 3 : 6
  },
  // Monkey 1:
  {
    inspectCount: 0,
    items: [63, 83, 50, 63, 56].map(n => MonkeyMath.createFromNumber(n)),
    operation: mn => MonkeyMath.add(mn, 2),
    test: mn => MonkeyMath.isDivisibleBy(mn, 13) ? 3 : 0
  },
  // Monkey 2:
  {
    inspectCount: 0,
    items: [93, 79, 74, 55].map(n => MonkeyMath.createFromNumber(n)),
    operation: mn => MonkeyMath.add(mn, 1),
    test: mn => MonkeyMath.isDivisibleBy(mn, 2) ? 0 : 1
  },
  // Monkey 3:
  {
    inspectCount: 0,
    items: [86, 61, 67, 88, 94, 69, 56, 91].map(n => MonkeyMath.createFromNumber(n)),
    operation: mn => MonkeyMath.add(mn, 7),
    test: mn => MonkeyMath.isDivisibleBy(mn, 11) ? 6 : 7
  },
  // Monkey 4:
  {
    inspectCount: 0,
    items: [76, 50, 51].map(n => MonkeyMath.createFromNumber(n)),
    operation: mn => MonkeyMath.squared(mn),
    test: mn => MonkeyMath.isDivisibleBy(mn, 19) ? 2 : 5
  },
  // Monkey 5:
  {
    inspectCount: 0,
    items: [77, 76].map(n => MonkeyMath.createFromNumber(n)),
    operation: mn => MonkeyMath.add(mn, 8),
    test: mn => MonkeyMath.isDivisibleBy(mn, 17) ? 2 : 1
  },
  // Monkey 6:
  {
    inspectCount: 0,
    items: [74].map(n => MonkeyMath.createFromNumber(n)),
    operation: mn => MonkeyMath.multiply(mn, 2),
    test: mn => MonkeyMath.isDivisibleBy(mn, 5) ? 4 : 7
  },
  // Monkey 7:
  {
    inspectCount: 0,
    items: [86, 85, 52, 86, 91, 95].map(n => MonkeyMath.createFromNumber(n)),
    operation: mn => MonkeyMath.add(mn, 6),
    test: mn => MonkeyMath.isDivisibleBy(mn, 7) ? 4 : 5
  }
];

const monkeys = monkeysActual;

// 20 rounds.
const numRounds = 10000;
const doDivision = false;
for (let i = 0; i < numRounds; i++) {
  // single round.
  monkeys.forEach((monkey) => {
    while (monkey.items.length > 0) {
      const nextItem = monkey.items.shift();
      const handled = monkey.operation(nextItem);
      let settled;
      if (!doDivision) {
        settled = handled;
      } else {
        settled = MonkeyMath.divide(handled, 3);
      }
      monkey.inspectCount++;
      const nexMonkeyIndex = monkey.test(settled);
      monkeys[nexMonkeyIndex].items.push(settled);
    }
  });
}

const inspectCounts = monkeys.map(monkey => monkey.inspectCount);
inspectCounts.sort((a, b) => {
  if (a === b) {
    return 0;
  } else if (a < b) {
    return -1;
  } else {
    return 1;
  }
});

const monkeyBusiness = inspectCounts[inspectCounts.length - 1] * inspectCounts[inspectCounts.length - 2];
console.log(inspectCounts);
console.log(monkeyBusiness);

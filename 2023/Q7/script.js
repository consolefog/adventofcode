import {readFileLines} from '../utils/readFileLines.js';
import {ROOT_DIR_2023} from '../utils/consts.js';

const handOrder = [
  'High card',
  'One pair',
  'Two pair',
  'Three of a kind',
  'Full house',
  'Four of a kind',
  'Five of a kind',
];

const cardOrderJackLowest = [
  'J',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  'T',
  'Q',
  'K',
  'A',
]

const cardOrderNatural = [
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  'T',
  'J',
  'Q',
  'K',
  'A',
]

function getCardToAddTo(a) {
  if (a === 'JJJJJ') {
    return 'A';
  }
  const jRemoved = a.replaceAll('J', '');
  const cardCounts = {
    ['2']: 0,
    ['3']: 0,
    ['4']: 0,
    ['5']: 0,
    ['6']: 0,
    ['7']: 0,
    ['8']: 0,
    ['9']: 0,
    ['T']: 0,
    ['Q']: 0,
    ['K']: 0,
    ['A']: 0,
  };

  let max = {
    card: undefined,
    count: 0,
  }

  const cards = jRemoved.split('');
  cards.forEach(card => {
    cardCounts[card] += 1;
    if (max.card === undefined) {
      max.card = card;
      max.count = cardCounts[card];
    } else {
      if (cardCounts[card] > max.count) {
        max.card = card;
        max.count = cardCounts[card];
      } else {
        if (cardCounts[card] === max.count) {
          if (cardOrderNatural.indexOf(card) > cardOrderNatural.indexOf(max.card)) {
            max.card = card;
            max.count = cardCounts[card];
          }
        }
      }
    }
  });

  return max.card;
}

function getCardCounts(a) {
  const cardCounts = {
    ['2']: 0,
    ['3']: 0,
    ['4']: 0,
    ['5']: 0,
    ['6']: 0,
    ['7']: 0,
    ['8']: 0,
    ['9']: 0,
    ['T']: 0,
    ['J']: 0,
    ['Q']: 0,
    ['K']: 0,
    ['A']: 0,
  };

  const split = a.split('');
  split.forEach(card => {
    cardCounts[card] += 1;
  });

  if (cardCounts['J'] !== 0) {
    const cardToAddTo = getCardToAddTo(a);
    if (cardToAddTo === 'J') {
      throw 'Error';
    }
    cardCounts[cardToAddTo] += cardCounts['J'];
    cardCounts['J'] = 0;
  }
  return cardCounts;
}

function getHandType(a) {
  const cardCounts = getCardCounts(a);

  const has5Same = cardOrderNatural.some(card => {
    return (cardCounts[card] === 5);
  })
  if (has5Same) {
    return 'Five of a kind';
  }

  const has4Same = cardOrderNatural.some(card => {
    return (cardCounts[card] === 4);
  })
  if (has4Same) {
    return 'Four of a kind';
  }

  let fullHouseThree = undefined;
  const has3Same = cardOrderNatural.some(card => {
    let hasThree = cardCounts[card] === 3;
    if (hasThree) {
      fullHouseThree = card;
    }
    return hasThree;
  })
  if (has3Same) {
    const has2OthersSame = cardOrderNatural.some(card => {
      return (cardCounts[card] === 2 && card !== fullHouseThree);
    })
    if (has2OthersSame) {
      return 'Full house';
    } else {
      return 'Three of a kind';
    }
  }

  let firstPair = undefined;
  const has2Same = cardOrderNatural.some(card => {
    let hasTwo = cardCounts[card] === 2;
    if (hasTwo) {
      firstPair = card;
    }
    return hasTwo;
  });

  if (has2Same) {
    const has2OthersSame = cardOrderNatural.some(card => {
      return (cardCounts[card] === 2 && card !== firstPair);
    });
    if (has2OthersSame) {
      return 'Two pair';
    } else {
      return 'One pair';
    }
  }

  return 'High card';
}

export const question = async () => {
  const hands = (await readFileLines(`${ROOT_DIR_2023}Q7/input.txt`)).map(line => {
    const handAndBid = line.split(' ');
    return ({
      hand: handAndBid[0],
      type: getHandType(handAndBid[0]),
      bid: parseInt(handAndBid[1]),
    });
  });

  hands.sort((handA, handB) => {
    if (handA.type !== handB.type) {
      return handOrder.indexOf(handA.type) - handOrder.indexOf(handB.type);
    } else {
      const aCards = handA.hand.split('');
      const bCards = handB.hand.split('');
      for (let i = 0; i < aCards.length; i++) {
        if (aCards[i] !== bCards[i]) {
          return cardOrderJackLowest.indexOf(aCards[i]) - cardOrderJackLowest.indexOf(bCards[i]);
        }
      }
      return 0;
    }
  });

  let total = 0;
  hands.forEach((hand, idx) => total += (idx + 1) * hand.bid)
  console.log(total);

  return Promise.resolve();
};

import {readFileLines} from '../utils/readFileLines.js';
import {ROOT_DIR_2023} from '../utils/consts.js';

const cardOrder = [
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

function getHandType(a) {
  const handCounts = {
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
  }
  const split = a.split('');
  split.forEach(card => {
    handCounts[card] += 1;
  });

  const has5Same = cardOrder.some(card => {
    return (handCounts[card] === 5);
  })
  if (has5Same) {
    return 'Five of a kind';
  }

  const has4Same = cardOrder.some(card => {
    return (handCounts[card] === 4);
  })
  if (has4Same) {
    return 'Four of a kind';
  }

  let fullHouseThree = undefined;
  const has3Same = cardOrder.some(card => {
    let hasThree = handCounts[card] === 3;
    if (hasThree) {
      fullHouseThree = card;
    }
    return hasThree;
  })
  if (has3Same) {
    const has2OthersSame = cardOrder.some(card => {
      return (handCounts[card] === 2 && card !== fullHouseThree);
    })
    if (has2OthersSame) {
      return 'Full house';
    } else {
      return 'Three of a kind';
    }
  }

  let firstPair = undefined;
  const has2Same = cardOrder.some(card => {
    let hasTwo = handCounts[card] === 2;
    if (hasTwo) {
      firstPair = card;
    }
    return hasTwo;
  });

  if (has2Same) {
    const has2OthersSame = cardOrder.some(card => {
      return (handCounts[card] === 2 && card !== firstPair);
    });
    if (has2OthersSame) {
      return 'Two pair';
    } else {
      return 'One pair';
    }
  }

  return 'High card';
}

const typeOrder = [
  'Five of a kind',
  'Four of a kind',
  'Full house',
  'Three of a kind',
  'Two pair',
  'One pair',
  'High card',
];



export const question = async () => {
  const lines = await readFileLines(`${ROOT_DIR_2023}Q7/input.txt`);
  const hands = [];
  lines.forEach(line => {
    const handAndBid = line.split(' ');
    const hand = handAndBid[0];
    const bid = parseInt(handAndBid[1]);
    hands.push({
      hand: hand,
      bid: bid
    });
  });

  hands.sort((handA, handB) => {
    const aHandString = handA.hand;
    const bHandString = handB.hand;
    const aType = getHandType(aHandString);
    const bType = getHandType(bHandString);
    if (aType !== bType) {
      return typeOrder.indexOf(aType) - typeOrder.indexOf(bType);
    } else {
      const aSplit = aHandString.split('');
      const bSplit = bHandString.split('');
      for (let i = 0; i < aSplit.length; i++) {
        let aCard = aSplit[i];
        let bCard = bSplit[i];
        if (aCard !== bCard) {
          return cardOrder.indexOf(bCard) - cardOrder.indexOf(aCard);
        }
      }
      return 0;
    }
  })

  hands.reverse();

  let total = 0;

  for (let i = 0; i < hands.length; i++) {
    let hand = hands[i];
    const rank = i + 1;
    const value = rank * hand.bid;
    total += value;
  }

  console.log(total);

  return Promise.resolve();
};

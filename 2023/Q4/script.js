import {readFileLines} from '../utils/readFileLines.js';
import {ROOT_DIR_2023} from '../utils/consts.js';

function findWinnersInCard(nums1, nums2) {
  return nums1.filter(n => nums2.includes(n))
}

export const question = async () => {
  const lines = await readFileLines(`${ROOT_DIR_2023}Q4/input.txt`);
  let total = 0;
  const data = [];
  lines.forEach(line => {
    let a = line.split(':')
    let intro = a[0];
    let nums = a[1];
    let numsTrimmed = nums.trim();
    let b = numsTrimmed.split('|')
    let winners = b[0].trim().split(/ +/)
    let card = b[1].trim().split(/ +/)
    const matches = findWinnersInCard(winners.map(n => parseInt(n, 10)), card.map(n => parseInt(n, 10)))
    let numMatches = matches.length;
    if (numMatches > 0) {
      let count = 0;
      matches.forEach(m => {
        if (count === 0) {
          count = 1;
        } else {
          count = count * 2;
        }
      });
      total += count;
    }
    let cardNumber = parseInt(intro.trim().split(' ')[1], 10);
    data.push({
      number: cardNumber,
      cardWinners: numMatches,
      additionalWinners: 0,
    })
  });

  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    const winners = item.cardWinners;
    console.log('card', item.number, 'original winners', item.cardWinners, 'additional', item.additionalWinners);
    for (let j = 0; j < winners; j++) {
      if ((i + j + 1) < data.length) {
        data[i + j + 1].additionalWinners += (1 + item.additionalWinners);
      }
    }
  }

  let totalScratchCardsNow = 0;
  data.forEach(d => {
    totalScratchCardsNow += 1;
    totalScratchCardsNow += d.additionalWinners
  })

  console.log(totalScratchCardsNow);

  return Promise.resolve();
};

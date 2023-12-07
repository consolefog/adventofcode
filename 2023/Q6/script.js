import {readFileLines} from '../utils/readFileLines.js';
import {ROOT_DIR_2023} from '../utils/consts.js';

export const question = async () => {
  const lines = await readFileLines(`${ROOT_DIR_2023}Q6/example.txt`);
  lines.forEach(line => {
    console.log(line);
  });

  const recordsExamples = [{
    time: 7,
    distance: 9
  },{
    time: 15,
    distance: 40
  },{
    time: 30,
    distance: 200
  }];

  const records = [{
    time: 40,
    distance: 215
  },{
    time: 70,
    distance: 1051
  },{
    time: 98,
    distance: 2147
  },{
    time: 79,
    distance: 1005
  }];

  let total = 1;

  records.forEach(record => {
    let wait = 0;
    let winningWaits = 0;
    while(wait <= record.time) {
      let timeRemaining = record.time - wait;
      let distance = wait * timeRemaining;
      if (distance > record.distance) {
        winningWaits++;
      }
      wait++;
    }
    console.log(winningWaits);
    total *= winningWaits;
  });

  console.log('total', total);

  // w^2 - w*40709879 + 215105121471005 < 0
  // w(w - 40709879) < 215105121471005

  let x = 215105121471005

  console.log(x);

  let winners = 0;

  let time = 40709879;
  for(let i = 0; i < time; i++) {
    let timeRemaining = time - i;
    let distance = i * timeRemaining;
    if (distance > 215105121471005) {
      winners++;
    }
  }

  console.log(winners);

  return Promise.resolve();
};

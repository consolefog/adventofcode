import { readFile } from 'node:fs/promises';

const YOU_ROCK = 'X';
const YOU_PAPER = 'Y';
const YOU_SCISSORS = 'Z';
const OPPONENT_ROCK = 'A';
const OPPONENT_PAPER = 'B';
const OPPONENT_SCISSORS = 'C';

const score = (opponentStr, youStr) => {
  const isWin =
    (youStr === YOU_ROCK && opponentStr === OPPONENT_SCISSORS) ||
    (youStr === YOU_PAPER && opponentStr === OPPONENT_ROCK) ||
    (youStr === YOU_SCISSORS && opponentStr === OPPONENT_PAPER)

  const isDraw =
    (youStr === YOU_ROCK && opponentStr === OPPONENT_ROCK) ||
    (youStr === YOU_PAPER && opponentStr === OPPONENT_PAPER) ||
    (youStr === YOU_SCISSORS && opponentStr === OPPONENT_SCISSORS)

  let totalScore = 0;

  if (youStr === YOU_ROCK) {
    totalScore += 1;
  } else if (youStr === YOU_PAPER) {
    totalScore += 2;
  } else if (youStr === YOU_SCISSORS) {
    totalScore += 3;
  }

  if (isWin) {
    totalScore += 6;
  } else if (isDraw) {
    totalScore += 3;
  }

  return totalScore;
}

const doWinDrawLose = (opponentStr, instruction) => {
  const isWin = instruction === 'Z'
  const isDraw = instruction === 'Y'

  let youStr;

  if (isDraw) {
    youStr = opponentStr;
  } else if (isWin) {
    youStr = {
      [OPPONENT_PAPER]: OPPONENT_SCISSORS,
      [OPPONENT_ROCK]: OPPONENT_PAPER,
      [OPPONENT_SCISSORS]: OPPONENT_ROCK,
    }[opponentStr];
  } else {
    youStr = {
      [OPPONENT_PAPER]: OPPONENT_ROCK,
      [OPPONENT_ROCK]: OPPONENT_SCISSORS,
      [OPPONENT_SCISSORS]: OPPONENT_PAPER,
    }[opponentStr];
  }

  let totalScore = 0;

  if (youStr === OPPONENT_ROCK) {
    totalScore += 1;
  } else if (youStr === OPPONENT_PAPER) {
    totalScore += 2;
  } else if (youStr === OPPONENT_SCISSORS) {
    totalScore += 3;
  }

  if (isWin) {
    totalScore += 6;
  } else if (isDraw) {
    totalScore += 3;
  }

  return totalScore;
}

const run = async () => {
  const contents = await readFile('./2022/Q2/input.txt', { encoding: 'utf8' });
  const lines = contents.split('\n')
  let totalScore = 0;
  lines.forEach((line) => {
    if (line.trim() === '') {
      // do nothing.
    } else {
      totalScore += score(line.trim().substring(0, 1), line.trim().substring(2,3))
    }
  });
  console.log(totalScore);
}

const part2 = async () => {
  const contents = await readFile('./2022/Q2/input.txt', { encoding: 'utf8' });
  const lines = contents.split('\n')
  let totalScore = 0;
  lines.forEach((line) => {
    if (line.trim() === '') {
      // do nothing.
    } else {
      totalScore += doWinDrawLose(line.trim().substring(0, 1), line.trim().substring(2,3))
    }
  });
  console.log(totalScore);
}

part2();

export const DEMO_DATA = {
  AA: {
    neighbors: ['DD', 'II', 'BB'],
    flow: 0,
  },
  BB: {
    neighbors: ['AA', 'CC'],
    flow: 13,
  },
  CC: {
    neighbors: ['BB', 'DD'],
    flow: 2
  },
  DD: {
    neighbors: ['AA', 'CC', 'EE'],
    flow: 20,
  },
  EE: {
    neighbors: ['FF', 'DD'],
    flow: 3,
  },
  FF: {
    neighbors: ['EE', 'GG'],
    flow: 0,
  },
  GG: {
    neighbors: ['FF', 'HH'],
    flow: 0,
  },
  HH: {
    neighbors: ['GG'],
    flow: 22,
  },
  II: {
    neighbors: ['AA', 'JJ'],
    flow: 0,
  },
  JJ: {
    neighbors: ['II'],
    flow: 21,
  }
};
